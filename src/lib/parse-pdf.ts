"use server";
import { PDFParse, type TypedArray } from "pdf-parse";

export const parsePdf = async (
  data: string | number[] | ArrayBuffer | TypedArray | undefined
) => {
  try {
    const parser = new PDFParse({ data });
    const result = await parser.getText();
    await parser.destroy()
    return result.text;
  } catch (error) {
    console.error(error);
  }
};
