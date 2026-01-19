import { and, asc, eq, ilike } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { InsertMessage, messages } from "@/db/schema";

export const _insertMessages = async (payload: InsertMessage[]) => {
  return db.insert(messages).values(payload).returning();
};

type GetMessagesParams = {
  query?: string;
  page?: number;
  limit?: number;
  chatId: string;
};

export const _getMessages = async (params: GetMessagesParams) => {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  const { query, limit = 10, page = 1, chatId } = params;

  const conditions = [eq(messages.chatId, chatId)];
  if (query) conditions.push(ilike(messages.content, query));

  const offset = (page - 1) * limit;
  return await db
    .select()
    .from(messages)
    .where(and(...conditions))
    .orderBy(asc(messages.createdAt))
    .limit(limit)
    .offset(offset);
};
