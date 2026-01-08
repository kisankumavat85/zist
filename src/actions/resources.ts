"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { resources } from "@/db/schema/resources";
import { createSupabaseClient } from "@/lib/supabase/server";

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

    const fileName = `${file.name}_${userId}_${new Date()}`;

    const supabase = await createSupabaseClient();
    const { data: uploadedFile, error } = await supabase.storage
      .from("resources")
      .upload(fileName, file, {
        contentType: file.type,
      });

    if (error) {
      return { success: false, message: "Failed to upload file" };
    }

    const [resource] = await db
      .insert(resources)
      .values({
        fileKey: uploadedFile.path,
        fileName: file.name,
        fileUrl: uploadedFile.fullPath,
        userId,
      })
      .returning();

    return { success: true, resource };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal server error" };
  }
};
