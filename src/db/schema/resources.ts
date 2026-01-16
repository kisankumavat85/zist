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
  name: text().notNull(),
  type: text().notNull(),
  fullPath: text("full_path").notNull(),
  path: text().notNull(),
  summary: text(),
  status: statusEnum().default("queued").notNull(),
  ...timestamps,
});

export type InsertResource = typeof resources.$inferInsert;
export type SelectResource = typeof resources.$inferSelect;
