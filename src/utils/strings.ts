export const sanitizeText = (text: string): string => {
  return (
    text
      // Remove leader dots common in TOCs (e.g., "Introduction . . . . . . 5")
      .replace(/(\. ?){3,}/g, " ")
      // 1. Remove the page number pattern (e.g., "-- 1 of 2 --")
      .replace(/-- \d+ of \d+ --/g, "")
      // 2. Replace multiple newlines/spaces with a single space (Fixes broken tables)
      .replace(/\s+/g, " ")
      // 3. Remove non-printable characters (often found in PDFs)
      .replace(/[^\x20-\x7E]/g, "")
      .trim()
  );
};
