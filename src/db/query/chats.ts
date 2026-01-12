import { db } from "..";
import { chats, InsertChat } from "../schema/chats";

export const insertChat = async (payload: InsertChat) => {
  return await db.insert(chats).values(payload).returning();
};
