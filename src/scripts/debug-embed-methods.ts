import { openai } from "@/lib/ai";
import { embed, embedMany } from "ai";
import { cosineDistance, sql } from "drizzle-orm"; // We can reuse Drizzle's math if available, or do it manually

// Simple manual cosine similarity function to avoid DB dependencies in this script
function calculateSimilarity(vecA: number[], vecB: number[]) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magA * magB);
}

async function runMethodTest() {
  const testInput = "Human anatomy is the study of the structures of the human body.";
  const model = openai.embedding("text-embedding-3-small");

  console.log("--- STARTING COMPARISON TEST ---");
  console.log(`Input: "${testInput.substring(0, 40)}..."`);

  // 1. Call embed (Singular)
  console.log("\n1. Calling embed() ...");
  const singleResult = await embed({
    model: model,
    value: testInput,
  });
  const vectorA = singleResult.embedding;
  console.log(`   - Vector A length: ${vectorA.length}`);

  // 2. Call embedMany (Plural)
  console.log("\n2. Calling embedMany() ...");
  const manyResult = await embedMany({
    model: model,
    values: [testInput], // Pass as array
  });
  const vectorB = manyResult.embeddings[0];
  console.log(`   - Vector B length: ${vectorB.length}`);

  // 3. Compare
  console.log("\n3. Comparing Vectors...");
  
  // Check exact equality of first 5 elements
  const sampleA = vectorA.slice(0, 5);
  const sampleB = vectorB.slice(0, 5);
  console.log("   - Sample A:", sampleA);
  console.log("   - Sample B:", sampleB);

  // Calculate Similarity
  const similarity = calculateSimilarity(vectorA, vectorB);
  console.log(`\n--- FINAL SIMILARITY: ${similarity} ---`);

  if (similarity > 0.999999) {
    console.log("✅ PASS: Vectors are identical.");
  } else {
    console.log("❌ FAIL: Vectors are DIFFERENT.");
  }
}

runMethodTest().catch(console.error);