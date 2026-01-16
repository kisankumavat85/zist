"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase/server";
import { inngest } from "@/lib/inngest/client";
import { BUCKET_NAME, FILE_TYPE_MAP, FOLDER_NAME } from "@/utils/constants";
import { getResources, insertResources } from "@/db/data/resources";
import { cache } from "react";

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

    await inngest
      .send({
        name: "resource/process",
        data: {
          userId,
          path: resource.path,
          resourceId: resource.id,
        },
      })
      .catch((reason) => {
        // FIXME: Later: If event fails to send resource status should be "failed"
        console.log("reason", reason);
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

export const getResourceById = cache(async (id: number) => {
  return (await getResources({ id }))[0];
});
