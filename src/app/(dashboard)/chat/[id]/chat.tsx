"use client";

import Message from "@/components/message";
import PromptInput from "@/components/prompt-input";
import { SelectChat, SelectMessage, SelectResource } from "@/db/schema";
import { useChat } from "@ai-sdk/react";
import { useAuth } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = {
  initialResources: SelectResource[];
  chat: SelectChat;
  resource: SelectResource;
  initialMessages: SelectMessage[];
};

const Chat = (props: Props) => {
  const { initialResources, chat, resource, initialMessages } = props;
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { userId } = useAuth();
  const { messages, sendMessage, status } = useChat({
    messages: initialMessages.map((message) => ({
      id: String(message.id),
      role: message.role,
      parts: [{ type: "text", text: message.content }],
    })),
    onError: (error) => {
      console.error("error", error);
    },
  });

  const [lastUserMessageId, setLastUserMessageId] = useState<string>("");

  useEffect(() => {
    const container = messagesContainerRef.current;
    const scrollContainer = scrollRef.current;

    if (!container || !scrollContainer) return;

    const mutationCallback = (mutations: MutationRecord[]) => {
      let userMessageNode: Element | null = null;

      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          const addedNodes = Array.from(mutation.addedNodes) as Element[];
          for (const node of addedNodes) {
            if (node?.id.includes("user")) {
              userMessageNode = node;
            }
          }
        }
      }

      if (userMessageNode) {
        const id = userMessageNode.id.replace("user-", "");
        setLastUserMessageId(id);
        requestAnimationFrame(() => {
          scrollContainer.scrollTo(0, scrollContainer.scrollHeight);
        });
      }
    };

    const observer = new MutationObserver(mutationCallback);
    observer.observe(container, {
      childList: true,
      attributes: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const onPromptSubmit = (prompt: string) => {
    const body = {
      chatId: chat.id,
      userId,
      resourceId: chat.resourceId,
    };

    sendMessage({ text: prompt }, { body });
  };

  return (
    <div className="flex-1 flex flex-col h-full w-full" id="scroll-path">
      <div
        className="flex-1 flex justify-center overflow-y-auto w-full scroll-smooth"
        id="chat-box-2"
        ref={scrollRef}
      >
        <div className="w-180" id="chat-box" ref={messagesContainerRef}>
          {messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              isLastUserMessage={lastUserMessageId === message.id}
            />
          ))}
          {status === "submitted" && (
            <div className="p-3">
              <Loader className="animate-spin" />
            </div>
          )}
        </div>
      </div>

      <div className="w-180 self-center">
        <PromptInput
          initialResources={initialResources}
          onSubmit={onPromptSubmit}
          resource={resource}
          isLoading={status === "streaming" || status === "submitted"}
        />
      </div>
    </div>
  );
};

export default Chat;
