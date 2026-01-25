"use client";

import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import { FileText, Plus } from "lucide-react";
import clsx from "clsx";
import { useParams, usePathname } from "next/navigation";
import { Separator } from "./ui/separator";
import { useEffect, useState } from "react";
import { getChats } from "@/actions/chats";
import { SelectChat } from "@/db/schema";

const navItems = [
  { title: "New chat", icon: <Plus />, url: "/chat" },
  { title: "Resources", icon: <FileText />, url: "/resources" },
];

export const ChatSidebar = () => {
  const pathname = usePathname();
  const { id } = useParams();
  const [chats, setChats] = useState<SelectChat[]>([]);
  const { isMobile, open, setOpenMobile } = useSidebar();

  useEffect(() => {
    const getChat = async () => {
      const chats = await getChats({ limit: 10 });
      setChats(chats || []);
    };
    getChat();
  }, []);

  const handleSidebarMenuButtonClick = () => {
    if (!isMobile) return;
    setOpenMobile(!open);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="p-2 text-xl font-extrabold text-center font-mono">
          Zist AI
        </h2>
      </SidebarHeader>
      {/* <Separator /> */}
      <SidebarContent className="px-2">
        <SidebarGroupContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  className={clsx("", {
                    "bg-secondary": pathname === item.url,
                  })}
                  asChild
                  onClick={handleSidebarMenuButtonClick}
                >
                  <Link href={item.url}>
                    {item.icon}
                    {item.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>

        <SidebarGroupContent>
          <SidebarGroupLabel className="">Your chats</SidebarGroupLabel>
          <SidebarMenu className="gap-0">
            {chats.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  asChild
                  className={clsx(
                    "text-ellipsis overflow-hidden whitespace-nowrap",
                    {
                      "bg-accent": id === item.id,
                    },
                  )}
                  onClick={handleSidebarMenuButtonClick}
                >
                  <Link href={`/chat/${item.id}`}>{item.title}</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
      <SidebarFooter>
        <Separator />
        <p className="text-center text-sm font-medium">
          Made with ❤️ by{" "}
          <Link href="https://kisan8.dev" target="_blank" className="underline">
            Kisan
          </Link>
        </p>
      </SidebarFooter>
    </Sidebar>
  );
};
