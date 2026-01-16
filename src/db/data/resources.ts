import "server-only";
import { and, desc, eq, ilike } from "drizzle-orm";
import { InsertResource, resources } from "../schema";
import { db } from "..";
import { cache } from "react";
import { auth } from "@clerk/nextjs/server";

type GetResourcesParams = {
  query?: string;
  page?: number;
  type?: string;
  limit?: number;
  id?: number;
};

export const getResources = async (params: GetResourcesParams) => {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  const { id, query, limit = 10, page = 1, type } = params;

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

export const insertResources = async (payload: InsertResource[]) => {
  return await db.insert(resources).values(payload).returning();
};
