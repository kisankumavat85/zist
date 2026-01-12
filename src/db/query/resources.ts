import { db } from "..";
import { InsertResource, resources } from "../schema/resources";

export const insertResource = async (payload: InsertResource) => {
  return await db.insert(resources).values(payload).returning();
};

export const selectResource = async () => {
  return await db.select().from(resources);
};
