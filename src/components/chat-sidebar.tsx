import Link from "next/link";
import { Button } from "./ui/button";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronUp, User2 } from "lucide-react";

const dummyItems = [
  {
    title: "File.pdf",
    url: "/chat",
  },
  {
    title: "Marketing.pdf",
    url: "/chat",
  },
  {
    title: "Customer.docx",
    url: "/chat",
  },
];

export const ChatSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="text-2xl font-bold text-center py-3">Zist AI</h2>
        <Button className="bg-blue-600">New Chat</Button>
      </SidebarHeader>
      <SidebarContent className="p-2 pt-6">
        <SidebarGroupLabel>Data Sources</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {dummyItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton>
                  <Link href={item.url}>{item.title}</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> Username
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top">
                <DropdownMenuItem>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
