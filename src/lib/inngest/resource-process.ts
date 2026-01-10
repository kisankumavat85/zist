import { eq } from "drizzle-orm";
import { NonRetriableError } from "inngest";
import { createSupabaseClient } from "../supabase/server";
import { inngest } from "./client";
import { parsePdf } from "../parse-pdf";
import { splitChunks } from "../langchain";
import { db } from "@/db";
import { resources } from "@/db/schema/resources";
import { generateEmbeddings } from "../ai/embedding";
import { embeddings, InsertEmbeddings } from "@/db/schema/embeddings";
import { BUCKET_NAME } from "@/utils/constants";

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
        .download(data.fullPath);

      if (error) throw error;
      if (!resource) throw new Error("Resource file not found");

      const arrayBuffer = await resource.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const chunks = await parsePdf(buffer);
      if (!chunks || chunks.length === 0)
        throw new NonRetriableError("Resource file is empty");

      const documents = await splitChunks(chunks);
      if (!documents) throw new Error("Error while splitting chunks");

      return documents.map((item) => item.pageContent);
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
      const rows = textChunks.map(
        (chunk, index) =>
          ({
            content: chunk,
            embedding: generatedEmbeddings[index],
            resourceId: data.resourceId,
          } as InsertEmbeddings)
      );

      await db.insert(embeddings).values(rows);
    });

    // Step.5 Update status to "Ready"
    await step.run("update-status-to-ready", async () => {
      await db
        .update(resources)
        .set({
          status: "ready",
        })
        .where(eq(resources.id, data.resourceId));
    });
  }
);
