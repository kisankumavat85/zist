"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { getChatById } from "@/actions/chats";
import { SidebarTrigger } from "./ui/sidebar";

export const Header = () => {
  const { id: chatId } = useParams();
  const [title, setTitle] = useState("");

  useEffect(() => {
    const getChat = async () => {
      if (chatId && !Array.isArray(chatId)) {
        const chat = await getChatById(chatId);
        setTitle(chat?.title || "");
      }
    };
    getChat();
  }, [chatId]);

  return (
    <div className="sticky top-0 z-10 bg-background border-b p-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-4">
        <SidebarTrigger variant="outline" />
        {chatId && <h3 className="text-base">{title}</h3>}
      </div>
      <div className="flex items-center">
        <UserButton showName />
      </div>
    </div>
  );
};
