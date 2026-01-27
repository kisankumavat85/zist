import "server-only";
import { and, desc, eq, ilike } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { chats, InsertChat } from "@/db/schema";

export const insertChats = async (payload: InsertChat[]) => {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  return await db.insert(chats).values(payload).returning();
};

export type GetChatsParams = {
  query?: string;
  page?: number;
  limit?: number;
  id?: string;
  userId: string;
};

export const _getChats = async (params: GetChatsParams) => {
  const { userId, id, query, limit = 10, page = 1 } = params;

  const conditions = [eq(chats.userId, userId)];
  if (query) conditions.push(ilike(chats.title, query));
  if (id) conditions.push(eq(chats.id, id));

  const offset = (page - 1) * limit;
  return await db
    .select()
    .from(chats)
    .where(and(...conditions))
    .orderBy(desc(chats.updatedAt))
    .limit(limit)
    .offset(offset);
};
