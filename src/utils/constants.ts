export const FOLDER_NAME = "resources";
export const BUCKET_NAME =
  process.env.NODE_ENV === "production" ? "prod" : "dev";

export const FILE_TYPE_MAP: Record<string, string> = {
  "application/pdf": "pdf",
};
