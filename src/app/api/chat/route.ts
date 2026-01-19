import { auth } from "@clerk/nextjs/server";
import { streamText, UIMessage, convertToModelMessages } from "ai";
import { and, cosineDistance, desc, eq, gt, sql } from "drizzle-orm";
import { db } from "@/db";
import { embeddings } from "@/db/schema/embeddings";
import { openai } from "@/lib/ai";
import { generateEmbedding } from "@/lib/ai/embedding";
import { chats } from "@/db/schema";
import { createMessage } from "@/actions/messages";

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
    const { messages, userId, chatId }: Payload = await request.json();

    if (userId !== _userId || !isAuthenticated) {
      return Response.json({ error: "Unauthenticated" }, { status: 401 });
    }

    if (!chatId) {
      return Response.json(
        { error: "chatId and resourceId are required" },
        { status: 400 }
      );
    }

    const [chat] = await db
      .select({
        resourceId: chats.resourceId,
      })
      .from(chats)
      .where(eq(chats.id, chatId));

    // Step 3: Create user message: with chat content tool invocation role and chat id
    const lastMessage = messages[messages.length - 1];
    let userMessage = "";

    if (lastMessage.role === "user") {
      const messageText = lastMessage.parts.find((p) => p.type === "text");
      if (messageText) {
        userMessage = messageText.text;
      }
    }

    if (!userMessage) {
      throw new Error("User message not found");
    }

    await createMessage([
      {
        chatId,
        role: lastMessage.role,
        content: userMessage,
      },
    ]);

    // Step 4: Create embeddings from user prompt
    const embedding = await generateEmbedding(userMessage);

    // Step 5: Search vector DB
    const similarity = sql<number>`1 - (${cosineDistance(
      embeddings.embedding,
      embedding
    )})`;

    const relevantChunks = await db
      .select({
        content: embeddings.content,
        similarity,
        chunkId: embeddings.id,
        resourceId: embeddings.resourceId,
      })
      .from(embeddings)
      .where(
        and(eq(embeddings.resourceId, chat.resourceId), gt(similarity, 0.5))
      ) // Only get result > 50% relevant
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
        await createMessage([
          {
            chatId,
            role: "assistant",
            content: text,
            toolInvocations: toolCalls,
          },
        ]);
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat error: ", error);
    return Response.json({
      error: true,
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};
