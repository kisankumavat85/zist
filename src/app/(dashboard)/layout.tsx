import { ChatSidebar } from "@/components/chat-sidebar";
import { Header } from "@/components/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const DashboardLayout = (props: Props) => {
  const { children } = props;
  return (
    <SidebarProvider>
      <ChatSidebar />
      <div className="w-full flex flex-col h-screen overflow-hidden">
        <Header />
        <main className="flex-1 py-4 min-h-0 w-full">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
