"use server";

import { _getMessages, _insertMessages } from "@/db/data/messages";
import { InsertMessage } from "@/db/schema";

export const createMessage = async (rows: InsertMessage[]) => {
  return await _insertMessages(rows);
};

export const getMessages = _getMessages;
