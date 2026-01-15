import { db } from "@/db";
import { embeddings } from "@/db/schema/embeddings";
import { openai } from "@/lib/ai";
import { embed, embedMany } from "ai";
import { cosineDistance, eq, sql } from "drizzle-orm";

async function runTest() {
  const testText = ["Its old insurance so I can not get those old statements"];

  console.log("1. Generating Embedding for:", testText);
  const { embeddings: embeddingss } = await embedMany({
    model: openai.embedding("text-embedding-3-small"),
    values: testText,
  });
  const { embedding: embedding2 } = await embed({
    model: openai.embedding("text-embedding-3-small"),
    value: "Its old insurance so I can not get those old statements",
  });
  console.log("   - Vector length:", embeddingss.length); // Should be 1536

  console.log("2. Inserting into DB...");
  const rows = testText.map((t, i) => ({
      resourceId: 40, // Dummy ID
      content: t,
      embedding: embeddingss[i],
    }))
  const [inserted] = await db
    .insert(embeddings)
    .values(rows)
    .returning();
  console.log("   - Inserted ID:", inserted.id);

  console.log("3. Querying SAME text immediately...");
  // We calculate distance manually to see exactly what the DB thinks
  const result = await db
    .select({
      id: embeddings.id,
      content: embeddings.content,
      // Raw Distance (0 = identical, 2 = opposite)
      rawDistance: cosineDistance(embeddings.embedding, embedding2),
      // Similarity (1 - distance)
      similarity: sql<number>`1 - (${cosineDistance(
        embeddings.embedding,
        embedding2
      )})`,
    })
    .from(embeddings)
    .where(eq(embeddings.id, inserted.id));

  console.log("4. RESULT:");
  console.log(JSON.stringify(result, null, 2));

  // Cleanup
  await db.delete(embeddings).where(eq(embeddings.id, inserted.id));
}

runTest().catch(console.error);
