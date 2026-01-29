export const FOLDER_NAME = "resources";
export const BUCKET_NAME =
  process.env.NODE_ENV === "production" ? "prod" : "dev";

export const FILE_TYPE_MAP: Record<string, string> = {
  "application/pdf": "pdf",
};

export const SUMMARY_SYSTEM_PROMPT = `
  You are an expert document summarization assistant. Your task is to generate a concise, high-level summary based on the beginning segments of a document.

  **Input Context:**
  You will be provided with the first 3 text chunks of a file. These chunks often contain the title, abstract, introduction, or table of contents. Note that the text may contain OCR artifacts, page numbers, or fragmented sentences.

  **Instructions:**
  1.  **Ignore Artifacts:** Disregard page headers (e.g., "Page 1 of 20"), footer dates, or repetitive formatting characters. Focus only on the semantic content.
  2.  **Identify the Core Subject:** Determine exactly what this document is (e.g., "A lecture on human anatomy," "An employee benefits guide," "A financial report for Q3 2024").
  3.  **Identify the Purpose:** Explain *why* this document exists (e.g., "To instruct students on basic histology," "To outline dental plan coverage details").
  4.  **Extract Key Entities:** If specific companies, authors, or distinct concepts are mentioned, include them.

  **Output Constraints:**
  - Write exactly **3 to 4 clear, professional sentences**.
  - **Do not** use bullet points. Write a single cohesive paragraph.
  - **Do not** start with phrases like "Based on the text provided..." or "Here is the summary:". Start directly with the subject.
  - If the text is unrecognizable or contains only random numbers/gibberish, return exactly: "This document appears to contain unstructured data or raw formatting without a clear topic."

  **Example Output:**
  "This document serves as a comprehensive guide to the company's 2024 dental and vision benefits, specifically detailing the Cigna DPPO network plans. It outlines coverage limits for preventative care, major restorative services, and orthodontia for employees and their dependents. Additionally, it provides contact information for the benefits concierge service to assist with claims and billing inquiries."
  `;

export const howItWorksSteps = [
  {
    title: "Upload",
    description:
      "Drag and drop in any PDF—lecture notes, contracts, or manuals. We handle the heavy lifting in the background.",
  },
  {
    title: "Analyze",
    description:
      'Our AI scans, cleans, and summarizes your document to understand the "big picture" before you even ask a question.',
  },
  {
    title: "Chat",
    description:
      "Ask questions in plain English. Get answers backed by the actual text in your document.",
  },
];

export const whyUseThis = [
  {
    title: "✨ Instant Smart Summaries",
    description:
      "Don't know where to start? Every document gets an automatic, high-level summary the moment it's processed, so you know exactly what the file is about immediately.",
  },
  {
    title: "🧹 Noise-Free Context",
    description:
      "Most AI tools get confused by headers, footers, and page numbers. We use advanced text sanitization to ensure the AI reads your content, not the formatting.",
  },
  {
    title: "🧠 Context-Aware Answers",
    description:
      "Powered by semantic vector search (text-embedding-3-small), the AI finds the exact paragraph needed to answer your specific questions without hallucinating.",
  },
];

export const faq = [
  {
    question: "Is this a production app?",
    answer:
      "This is a robust open-source demo designed to explore Retrieval Augmented Generation (RAG) architectures. While fully functional, it's built primarily for learning and demonstration purposes.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Your files are processed securely. Since this is a demo, we recommend not uploading sensitive personal or financial documents.",
  },
];
