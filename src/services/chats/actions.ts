import { GetChatsParams } from "@/db/data/chats";
import { ChatsSchema } from "./schemas";
import { convertToSearchParams } from "@/utils/search-params";

export const getChats = async (params: Omit<GetChatsParams, "userId">) => {
  try {
    const searchParams = convertToSearchParams(params).toString();
    const api = `/api/chats/?${searchParams}`;
    const response = await fetch(api);
    const data = await response.json();
    return ChatsSchema.parse(data);
  } catch (error) {
    console.error(error);
  }
};
