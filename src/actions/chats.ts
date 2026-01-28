"use server";

import { cache } from "react";
import {
  _deleteChat,
  _getChats,
  _updateChatTitle,
  insertChats,
} from "@/db/data/chats";
import { InsertChat, SelectChat } from "@/db/schema";
import { ServerAction } from "@/types";
import { auth } from "@clerk/nextjs/server";

type CreateChatsResult =
  | { success: true; chats: SelectChat[] }
  | { success: false; message: string };

export const createChats: ServerAction<
  [InsertChat[]],
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
    console.error(error);
  }
});

export const getChats = _getChats;

export const deleteChat = async (id: string) => {
  try {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) return redirectToSignIn();
    return await _deleteChat({ id, userId });
  } catch (error) {
    console.error(error);
  }
};

type UpdateChatResult =
  | { success: true; chats: SelectChat[] }
  | { success: false; message: string };

export const updateChatTitle: ServerAction<
  [string, string],
  UpdateChatResult
> = async (title: string, id: string) => {
  try {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) return redirectToSignIn();
    const chats = await _updateChatTitle({ id, userId, title });
    return { success: true, chats };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Something went wrong!" };
  }
};
