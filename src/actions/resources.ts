"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase/server";
import { inngest } from "@/lib/inngest/client";
import { BUCKET_NAME, FILE_TYPE_MAP, FOLDER_NAME } from "@/utils/constants";
import { InsertResource, resources } from "@/db/schema";
import { db } from "@/db";
import { and, desc, eq, ilike } from "drizzle-orm";

export const uploadResource = async (formData: FormData) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, message: "Unauthenticated" };
    }

    const file = formData.get("resource") as File;
    if (!file || file.name === undefined) {
      return { success: false, message: "No file provided" };
    }

    const fileName = file.name;
    const filePath = `${FOLDER_NAME}/${fileName}_${Date.now()}`;

    const supabase = await createSupabaseClient();
    const { data: uploadedFile, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        contentType: file.type,
      });

    if (error) {
      throw error;
    }

    const [resource] = await insertResources([
      {
        path: uploadedFile.path,
        name: file.name,
        type: FILE_TYPE_MAP[file.type as string],
        fullPath: uploadedFile.fullPath,
        userId,
      },
    ]);

    // FIXME: Later: If event fails resource status should be "failed"
    await inngest.send({
      name: "resource/process",
      data: {
        userId,
        path: resource.path,
        resourceId: resource.id,
      },
    });

    revalidatePath("/resources");

    return { success: true, resource };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    };
  }
};

export const insertResources = async (payload: InsertResource[]) => {
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

export const getResources = async (params: SelectResourceParams) => {
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
