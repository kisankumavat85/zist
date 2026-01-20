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

  useEffect(() => {
    const getChat = async () => {
      const chats = await getChats({ limit: 10 });
      setChats(chats || []);
    };
    getChat();
  }, []);

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
          <SidebarMenu>
            {chats.map((item) => (
              <SidebarMenuItem
                key={item.id}
                className={clsx(
                  "text-ellipsis overflow-hidden whitespace-nowrap py-1 px-2 rounded",
                  {
                    "bg-secondary": id === item.id,
                  }
                )}
              >
                <Link href={`/chat/${item.id}`}>{item.title}</Link>
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
