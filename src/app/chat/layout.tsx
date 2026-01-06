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
      <div>
        <Header />
        <main className="p-4">{children}</main>
      </div>
    </SidebarProvider>
  );
};

export default ChatLayout;
