"use server";

import { cache } from "react";
import { _getChats, insertChats } from "@/db/data/chats";
import { InsertChat, SelectChat } from "@/db/schema";
import { ServerAction } from "@/types";
import { auth } from "@clerk/nextjs/server";

type CreateChatsResult =
  | { success: true; chats: SelectChat[] }
  | { success: false; message: string };

export const createChats: ServerAction<
  InsertChat[],
  CreateChatsResult
> = async (rows) => {
  try {
    const chats = await insertChats(rows);
    return { success: true, chats };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Something went wrong!" };
  }
};

export const getChatById = cache(async (chatId: string) => {
  try {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) return redirectToSignIn();
    return (await _getChats({ id: chatId, userId }))[0];
  } catch (error) {
    console.error("error", error);
  }
});

export const getChats = _getChats;
