import { getChats } from "@/actions/chats";
import { ChatSidebar } from "@/components/chat-sidebar";
import { Header } from "@/components/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@clerk/nextjs/server";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

type Props = {
  children: React.ReactNode;
};

const DashboardLayout = async (props: Props) => {
  const { children } = props;
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    redirectToSignIn();
    return;
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["sidebar-chats"],
    queryFn: () => getChats({ userId, limit: 10 }),
  });

  return (
    <SidebarProvider>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ChatSidebar />
      </HydrationBoundary>
      <div className="w-full flex flex-col h-screen overflow-hidden">
        <Header />
        <main className="flex-1 min-h-0 w-full">{children}</main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
