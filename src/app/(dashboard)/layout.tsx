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
      <div className="w-full flex flex-col">
        <Header />
        <main className="flex-1 self-center w-160  py-8">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
