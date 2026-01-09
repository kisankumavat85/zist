import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const splitChunks = async (rawText: string) => {
  try {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
      separators: ["\n\n", "\n", ".", " "],
    });
    const documents = await splitter.createDocuments([rawText]);
    return documents;
  } catch (error) {
    console.error(error);
  }
};
