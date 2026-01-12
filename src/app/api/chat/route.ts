import { db } from "@/db";
import { insertMessage } from "@/db/query/messages";
import { embeddings } from "@/db/schema/embeddings";
import { openai } from "@/lib/ai";
import { generateEmbedding } from "@/lib/ai/embedding";
import { auth } from "@clerk/nextjs/server";
import { streamText, UIMessage, convertToModelMessages } from "ai";
import { and, cosineDistance, desc, eq, gt, sql } from "drizzle-orm";
import { messages as messagesSchema } from "@/db/schema/messages";

type Payload = {
  messages: UIMessage[];
  userId: string;
  chatId: string;
  resourceId: number;
};

export const POST = async (request: Request) => {
  try {
    const { isAuthenticated, userId: _userId } = await auth();

    // Step 1: Get user prompt
    const { messages, chatId, userId, resourceId }: Payload =
      await request.json();

    if (userId !== _userId || !isAuthenticated) {
      return Response.json({ error: "Unauthenticated" }, { status: 401 });
    }

    if (!chatId || !resourceId) {
      return Response.json(
        { error: "ChatId and resourceId are required" },
        { status: 400 }
      );
    }

    console.log("messages", messages);

    // Step 3: Create user message: with chat content tool invocation role and chat id
    const lastMessage = messages[messages.length - 1];
    const content = lastMessage.parts.join(". "); // NOTE: Check part type in future

    await insertMessage({
      chatId,
      role: lastMessage.role,
      content,
    });

    // Step 4: Create embeddings from user prompt
    const embedding = await generateEmbedding(content);

    // Step 5: Search vector DB
    const similarity = sql<number>`1 - (${cosineDistance(
      embeddings.embedding,
      embedding
    )})`;

    const relevantChunks = await db
      .select({
        content: embeddings.content,
        similarity,
      })
      .from(embeddings)
      .where(and(eq(embeddings.resourceId, resourceId), gt(similarity, 0.5))) // Only get result > 50% relevant
      .orderBy(desc(similarity))
      .limit(4);

    // Step 6: Send user prompt and content of searched from vector db to open ai
    const contextBlock = relevantChunks
      .map((chunk) => chunk.content)
      .join("\n\n---\n\n"); // Separator helps AI distinguish chunks

    const systemPrompt = `
      You are an AI assistant for a document knowledge base.

      START OF CONTEXT BLOCK
      ${contextBlock}
      END OF CONTEXT BLOCKa

      Instructions:
      - Answer the question based *only* on the context block above.
      - If the answer is not in the context, politely say you don't have that information.
      - Keep your answer professional and concise.
    `;

    // Step 7: Stream output
    const result = streamText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
      onFinish: async ({ text, toolCalls }) => {
        await db.insert(messagesSchema).values({
          chatId,
          role: "assistant",
          content: text,
          toolInvocations: toolCalls,
        });
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat error: ", error);
    throw error;
  }
};
