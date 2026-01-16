import { eq } from "drizzle-orm";
import { NonRetriableError } from "inngest";
import { createSupabaseClient } from "../supabase/server";
import { inngest } from "./client";
import { parsePdf } from "../parse-pdf";
import { splitChunks } from "../langchain";
import { db } from "@/db";
import { resources } from "@/db/schema/resources";
import { generateEmbeddings } from "../ai/embedding";
import { embeddings } from "@/db/schema/embeddings";
import { BUCKET_NAME, SUMMARY_SYSTEM_PROMPT } from "@/utils/constants";
import { sanitizeText } from "@/utils/strings";
import { generateText } from "ai";
import { openai } from "../ai";

export const resourceProcess = inngest.createFunction(
  {
    id: "resource-process",
    retries: 2,
    onFailure: async ({ event, step }) => {
      const resourceId = event.data.event.data.resourceId;

      await step.run("update-status-to-failed", async () => {
        await db
          .update(resources)
          .set({
            status: "failed",
          })
          .where(eq(resources.id, resourceId));
      });

      await step.run("delete-embeddings-on-failure", async () => {
        await db
          .delete(embeddings)
          .where(eq(embeddings.resourceId, resourceId));
      });
    },
  },
  {
    event: "resource/process",
  },
  async ({ event: { data }, step }) => {
    // Step.2 Update status
    await step.run("update-status-to-processing", async () => {
      await db
        .update(resources)
        .set({
          status: "processing",
        })
        .where(eq(resources.id, data.resourceId));
    });

    // Step.2 Generate chunks
    const textChunks = await step.run("generate-chunks", async () => {
      const supabase = await createSupabaseClient();
      const { data: resource, error } = await supabase.storage
        .from(BUCKET_NAME)
        .download(data.path);

      if (error) throw error;
      if (!resource) throw new Error("Resource file not found");

      const arrayBuffer = await resource.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const chunks = await parsePdf(buffer);
      if (!chunks || chunks.length === 0)
        throw new NonRetriableError("Resource file is empty");

      const documents = await splitChunks(chunks);
      if (!documents) throw new Error("Error while splitting chunks");

      return documents
        .map((item) => sanitizeText(item.pageContent))
        .filter((content) => content.length > 8); // Drop chunks with < 8 chars (useless noise);
    });

    // Step.3 Generate embeddings
    const generatedEmbeddings = await step.run(
      "generate-embeddings",
      async () => {
        const embeddings = await generateEmbeddings(textChunks);
        return embeddings;
      }
    );

    // Step.4 Add embeddings to db
    await step.run("add-embeddings-to-db", async () => {
      const rows = textChunks.map((chunk, index) => {
        const embedding = generatedEmbeddings[index];
        return {
          content: chunk,
          embedding: embedding,
          resourceId: data.resourceId,
        };
      });

      await db.insert(embeddings).values(rows);
    });

    // Step.5 Generate summary
    const summary = await step.run("generate-summary", async () => {
      const result = await generateText({
        model: openai("gpt-4o"),
        system: SUMMARY_SYSTEM_PROMPT,
        prompt: `CONTENT TO SUMMARIZE:\n\n${textChunks
          .splice(0, 3)
          .join("\n\n")}`,
      });

      console.log('Summary result -------------------\n', result)

      return result.text;
    });

    // Step.6 Update status to "Ready"
    await step.run("update-status-to-ready", async () => {
      await db
        .update(resources)
        .set({
          status: "ready",
          summary,
        })
        .where(eq(resources.id, data.resourceId));
    });
  }
);
