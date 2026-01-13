"use server";

import { and, desc, eq, ilike } from "drizzle-orm";
import { db } from "..";
import { InsertResource, resources } from "../schema/resources";

export const insertResource = async (payload: InsertResource) => {
  return await db.insert(resources).values(payload).returning();
};

type SelectResourceParams = {
  query?: string;
  page?: number;
  type?: string;
  limit?: number;
  userId: string;
  id?: number;
};

export const selectResource = async (params: SelectResourceParams) => {
  const { id, query, limit = 10, page = 1, type, userId } = params;

  const conditions = [eq(resources.userId, userId)];
  if (query) conditions.push(ilike(resources.name, query));
  if (type) conditions.push(eq(resources.type, type));
  if (id) conditions.push(eq(resources.id, id));

  const offset = (page - 1) * limit;

  return await db
    .select()
    .from(resources)
    .where(and(...conditions))
    .orderBy(desc(resources.createdAt))
    .limit(limit)
    .offset(offset);
};
