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
import { useChats } from "@/services/chats/hooks";
import { Suspense } from "react";
import { Skeleton } from "./ui/skeleton";

const navItems = [
  { title: "New chat", icon: <Plus />, url: "/chat" },
  { title: "Resources", icon: <FileText />, url: "/resources" },
];

export const ChatSidebar = () => {
  const pathname = usePathname();
  const { id } = useParams();
  const { isMobile, open, setOpenMobile } = useSidebar();
  const { data: chats = [] } = useChats({});

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
          <Suspense fallback={<ChatsLoader />}>
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
          </Suspense>
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

const ChatsLoader = () => {
  return (
    <div className="flex flex-col">
      {new Array(10).fill("").map((_, index) => (
        <Skeleton key={index} className="h-4 m-2" />
      ))}
    </div>
  );
};
