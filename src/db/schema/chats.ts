import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "./column-helpers";
import { resources } from "./resources";

export const chats = pgTable("chats", {
  id: uuid().defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  resourceId: integer("resource_id")
    .references(() => resources.id, {
      onDelete: "cascade",
    })
    .notNull(),
  title: text().notNull(),
  createdAt: timestamps.createdAt,
});

export type InsertChat = typeof chats.$inferInsert;
