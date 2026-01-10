"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { resources } from "@/db/schema/resources";
import { createSupabaseClient } from "@/lib/supabase/server";
import { inngest } from "@/lib/inngest/client";
import { BUCKET_NAME, FOLDER_NAME } from "@/utils/constants";

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

    const fileName = `${FOLDER_NAME}/${file.name}_${Date.now()}`;

    const supabase = await createSupabaseClient();
    const { data: uploadedFile, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        contentType: file.type,
      });

    if (error) {
      throw error;
    }

    const [resource] = await db
      .insert(resources)
      .values({
        fileKey: uploadedFile.path,
        fileName: file.name,
        fileFullPath: uploadedFile.fullPath,
        userId,
      })
      .returning();

    await inngest.send({
      name: "resource/process",
      data: {
        userId,
        fullPath: resource.fileFullPath,
        resourceId: resource.id,
      },
    });

    return { success: true, resource };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal server error" };
  }
};
