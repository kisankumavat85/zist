import { openai } from "@/lib/ai";
import { embed } from "ai";

const text = `Anatomy Lecture Notes Section 1: Introduction to Anatomy What is Human Anatomy? Human anatomy, including histology and gross anatomy, is the study of the structures of the human body. The discipline of human anatomy involves the identification and description of the structures within the human body. Whats in a Name? Answer: Everything. Due to the fact that most anatomical names come from Latin and Greek, these words have meaning in their original language, and it is very helpful and interesting to know the root meaning of these words, which is called etymology, as it helps in the learning process. Therefore, becoming familiar with the etymology of the anatomical term s is an important component of studying human anatomy. For example, the word anatomy comes from the Greek language, composed of ana = up or apart, and tome = a cutting. Therefore, the word anatomy means "cutting up or apart". As will become`;

async function check() {
  const { embedding } = await embed({
    model: openai.embedding("text-embedding-3-small"),
    value: text,
  });
  console.log("FRESH Local Embedding (First 3):", embedding.slice(0, 3));
}
check();