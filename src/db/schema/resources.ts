import { pgEnum, pgTable, serial, text } from "drizzle-orm/pg-core";
import { timestamps } from "./column-helpers";

export const statusEnum = pgEnum("status", [
  "queued",
  "processing",
  "ready",
  "failed",
]);

export const resources = pgTable("resources", {
  id: serial().primaryKey(),
  userId: text("user_id").notNull(),
  fileName: text("file_name").notNull(),
  fileFullPath: text("file_url").notNull(),
  fileKey: text("file_key").notNull(),
  status: statusEnum("status").default("queued").notNull(),
  ...timestamps,
});

export type InsertResource = typeof resources.$inferInsert;
export type SelectResource = typeof resources.$inferSelect;
