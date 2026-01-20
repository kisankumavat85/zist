"use server";
import { extractText, getDocumentProxy } from "unpdf";

export const parsePdf = async (
  data: string | number[] | ArrayBuffer | undefined,
) => {
  try {
    const pdf = await getDocumentProxy(data);
    const { text } = await extractText(pdf, {
      mergePages: true,
    });
    return text;
  } catch (error) {
    console.error(error);
  }
};
