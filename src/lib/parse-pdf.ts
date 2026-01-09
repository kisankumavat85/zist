"use server";
import { PDFParse } from "pdf-parse";

export const parsePdf = async (url: string) => {
  try {
    const parser = new PDFParse({ url });
    const result = await parser.getText();
    return result.text;
  } catch (error) {
    console.error(error);
  }
};
