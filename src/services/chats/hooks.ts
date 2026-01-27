import { useSuspenseQuery } from "@tanstack/react-query";
import { getChats } from "./actions";
import { GetChatsParams } from "@/db/data/chats";

export const useChats = (params: Omit<GetChatsParams, "userId">) => {
  return useSuspenseQuery({
    queryKey: ["sidebar-chats"],
    queryFn: () => getChats(params),
  });
};
