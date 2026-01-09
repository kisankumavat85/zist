import { openai } from ".";
import { embedMany } from "ai";

export const generateEmbeddings = async (input: string[]) => {
  const { embeddings } = await embedMany({
    model: openai.embedding("text-embedding-3-small"),
    values: input,
  });
  return embeddings;
};
