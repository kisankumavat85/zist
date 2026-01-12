import { db } from "..";
import { InsertMessage, messages } from "../schema/messages";

export const insertMessage = async (payload: InsertMessage) => {
  return db.insert(messages).values(payload).returning();
};
