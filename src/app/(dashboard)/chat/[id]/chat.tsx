"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useChat } from "@ai-sdk/react";
import { useAuth } from "@clerk/nextjs";
import PromptInput from "@/components/prompt-input";
import { SelectChat, SelectMessage, SelectResource } from "@/db/schema";

const Message = dynamic(() => import("@/components/message"));
const Loader = dynamic(
  () => import("lucide-react").then((module) => module.Loader),
  {
    loading: () => <p>Loading.......</p>,
    ssr: false,
  },
);

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

  const onPromptSubmit = useCallback(
    (prompt: string) => {
      const body = {
        chatId: chat.id,
        userId,
        resourceId: chat.resourceId,
      };

      sendMessage({ text: prompt }, { body });
    },
    [chat.id, chat.resourceId, sendMessage, userId],
  );

  useEffect(() => {
    const prompt = localStorage.getItem("prompt");
    // If prompt set from /chat page submit the prompt
    if (prompt) {
      onPromptSubmit(prompt);
      localStorage.removeItem("prompt");
    }
  }, [onPromptSubmit]);

  useEffect(() => {
    const lastMessage = messages
      .filter((message) => message.role === "user")
      .pop();

    if (!lastMessage) return;
    const id = `user-${lastMessage.id}`;
    const element = document.getElementById(id);

    if (!element) return;
    requestAnimationFrame(() => {
      element.scrollIntoView();
    });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col h-full w-full">
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

      <div className="w-180 self-center pb-4">
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
