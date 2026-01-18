import Chat from "./chat";
import { getChatById } from "@/actions/chats";
import { redirect } from "next/navigation";
import { getResourceById, getResources } from "@/actions/resources";
import { getMessages } from "@/actions/messages";

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
  const messages = await getMessages({ chatId });

  return (
    <Chat
      initialResources={resources}
      initialMessages={messages}
      chat={chat}
      resource={resource}
    />
  );
};

export default ActiveChatPage;
