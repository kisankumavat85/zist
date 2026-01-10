import {
  index,
  integer,
  pgTable,
  serial,
  text,
  vector,
} from "drizzle-orm/pg-core";
import { resources } from "./resources";

export const embeddings = pgTable(
  "embeddings",
  {
    id: serial().primaryKey(),
    resourceId: integer("resource_id").references(() => resources.id, {
      onDelete: "cascade",
    }),
    content: text().notNull(),
    embedding: vector("embedding", {
      dimensions: 1536,
    }).notNull(),
  },
  (table) => ({
    embeddingIndex: index("embeddingIndex").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops")
    ),
  })
);

export type InsertEmbeddings = typeof embeddings.$inferInsert;
