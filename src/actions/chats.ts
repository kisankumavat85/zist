"use server";

import { db } from "@/db";
import { chats, InsertChat } from "@/db/schema";

export const insertChats = async (payload: InsertChat[]) => {
  return await db.insert(chats).values(payload).returning();
};
