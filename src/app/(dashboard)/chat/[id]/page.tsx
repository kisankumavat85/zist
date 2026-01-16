import { getResources } from "@/db/data/resources";
import Chat from "./chat";
import { getChatById } from "@/actions/chats";
import { redirect } from "next/navigation";
import { getResourceById } from "@/actions/resources";

type Props = { params: Promise<{ id: string }> };

const ActiveChatPage = async (props: Props) => {
  const { params } = props;
  const { id: chatId } = await params;
  const resources = await getResources({ limit: 5 });
  const chat = await getChatById(chatId);

  if (!chat) {
    redirect("/chat");
  }
  const resource = await getResourceById(chat.resourceId);

  return (
    <Chat initialResources={resources} chat={chat} resource={resource} />
  );
};

export default ActiveChatPage;
