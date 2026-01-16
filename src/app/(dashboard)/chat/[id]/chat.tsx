"use client";

import PromptInput from "@/components/prompt-input";
import { SelectChat, SelectResource } from "@/db/schema";
import { useChat } from "@ai-sdk/react";
import { useAuth } from "@clerk/nextjs";

type Props = {
  initialResources: SelectResource[];
  chat: SelectChat;
  resource: SelectResource;
};

const Chat = (props: Props) => {
  const { initialResources, chat, resource } = props;
  const { userId } = useAuth();
  const { messages, sendMessage, status } = useChat();

  console.log({ messages, status });

  const onPromptSubmit = (prompt: string) => {
    const body = {
      chatId: chat.id,
      userId,
      resourceId: chat.resourceId,
    };

    console.log("body", body);
    sendMessage({ text: prompt }, { body });
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex-1 border">
        <h1 className="text-2xl">{chat.id}</h1>
        <p>{messages.map((m) => m.parts.map((p) => p.text))}</p>
      </div>
      <div className="">
        <div className=""></div>
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
