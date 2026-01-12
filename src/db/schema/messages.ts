import {
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { chats } from "./chats";
import { timestamps } from "./column-helpers";

export const roleEnum = pgEnum("role", ["system", "user", "assistant", "data"]);

export const messages = pgTable("messages", {
  id: serial().primaryKey(),
  chatId: uuid("chat_id")
    .references(() => chats.id, { onDelete: "cascade" })
    .notNull(),
  role: roleEnum().notNull(),
  content: text(),
  toolInvocations: jsonb("tool_invocations"),

  createdAt: timestamps.createdAt,
});

export type InsertMessage = typeof messages.$inferInsert;
