import { ChatSidebar } from "@/components/chat-sidebar";
import { Header } from "@/components/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const ChatLayout = (props: Props) => {
  const { children } = props;
  return (
    <SidebarProvider>
      <ChatSidebar />
      <div className="w-full">
        <Header />
        <main className="p-4 h-[100% - 61px]">{children}</main>
      </div>
    </SidebarProvider>
  );
};

export default ChatLayout;
