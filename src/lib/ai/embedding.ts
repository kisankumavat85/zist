import { openai } from ".";
import { embed, embedMany } from "ai";

export const generateEmbeddings = async (input: string[]) => {
  const { embeddings } = await embedMany({
    model: openai.embeddingModel("text-embedding-3-small"),
    values: input,
  });
  return embeddings;
};

export const generateEmbedding = async (input: string) => {
  const { embedding } = await embed({
    model: openai.embeddingModel("text-embedding-3-small"),
    value: input,
  });
  return embedding;
};
