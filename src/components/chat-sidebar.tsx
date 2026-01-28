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
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import { FileText, MoreHorizontal, Plus, Trash } from "lucide-react";
import clsx from "clsx";
import { useParams, usePathname } from "next/navigation";
import { Separator } from "./ui/separator";
import { useChats } from "@/services/chats/hooks";
import { Suspense } from "react";
import { Skeleton } from "./ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { SelectChat } from "@/db/schema";
import { useModals } from "@/hooks/use-modals";

const navItems = [
  { title: "New chat", icon: <Plus />, url: "/chat" },
  { title: "Resources", icon: <FileText />, url: "/resources" },
];

export const ChatSidebar = () => {
  const pathname = usePathname();
  const { id } = useParams();
  const { isMobile, open, setOpenMobile } = useSidebar();
  const { data: chats = [] } = useChats({ limit: 30 });
  const { onOpen } = useModals();

  const handleSidebarMenuButtonClick = () => {
    if (!isMobile) return;
    setOpenMobile(!open);
  };

  const handleChatDeleteClick = async (chat: SelectChat) => {
    onOpen("confirm-delete-chat", chat);
  };

  const handleChatRenameClick = async (chat: SelectChat) => {
    onOpen("rename-chat", chat);
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
                <SidebarMenuItem key={item.id} className="group/item">
                  <SidebarMenuButton
                    asChild
                    className={clsx("whitespace-nowrap", {
                      "bg-accent": id === item.id,
                    })}
                    onClick={handleSidebarMenuButtonClick}
                  >
                    <Link href={`/chat/${item.id}`}>
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      className="invisible group-hover/item:visible data-[state=open]:visible"
                    >
                      <SidebarMenuAction>
                        <MoreHorizontal />
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start">
                      <DropdownMenuItem
                        onClick={() => handleChatRenameClick(item)}
                      >
                        <span>Rename chat</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleChatDeleteClick(item)}
                      >
                        <Trash className="text-destructive" />
                        <span className="text-destructive">Delete Chat</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
