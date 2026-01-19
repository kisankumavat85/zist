"use client";

import Messages from "@/components/messages";
import PromptInput from "@/components/prompt-input";
import { SelectChat, SelectMessage, SelectResource } from "@/db/schema";
import { useChat } from "@ai-sdk/react";
import { useAuth } from "@clerk/nextjs";

type Props = {
  initialResources: SelectResource[];
  chat: SelectChat;
  resource: SelectResource;
  initialMessages: SelectMessage[];
};

const Chat = (props: Props) => {
  const { initialResources, chat, resource, initialMessages } = props;
  const { userId } = useAuth();
  const { messages, sendMessage, status } = useChat({
    messages: initialMessages.map((message) => ({
      id: String(message.id),
      role: message.role,
      parts: [{ type: "text", text: message.content }],
    })),
  });

  console.log({ messages, status });

  const onPromptSubmit = (prompt: string) => {
    const body = {
      chatId: chat.id,
      userId,
      resourceId: chat.resourceId,
    };

    sendMessage({ text: prompt }, { body });
  };

  return (
    <div className="flex-1 flex flex-col h-full w-full">
      <div className="flex-1 flex justify-center overflow-y-auto w-full">
        <Messages messages={messages} />
      </div>
      <div className="w-180 self-center">
        <PromptInput
          initialResources={initialResources}
          onSubmit={onPromptSubmit}
          resource={resource}
        />
      </div>
    </div>
  );
};

export default Chat;
