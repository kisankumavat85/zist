"use server";

import { _getChats, insertChats } from "@/db/data/chats";
import { InsertChat } from "@/db/schema";
import { cache } from "react";

export const createChats = async (rows: InsertChat[]) => {
  return await insertChats(rows);
};

export const getChatById = cache(async (chatId: string) => {
  try {
    return (await _getChats({ id: chatId }))[0];
  } catch (error) {
    console.error("error", error);
  }
});

export const getChats = _getChats;
