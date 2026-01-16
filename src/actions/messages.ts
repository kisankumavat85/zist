"use server";

import { db } from "@/db";
import { InsertMessage, messages } from "@/db/schema";

export const insertMessages = async (payload: InsertMessage[]) => {
  return db.insert(messages).values(payload).returning();
};
