import { SidebarTrigger } from "./ui/sidebar";
import { UserButton } from "@clerk/nextjs";

export const Header = () => {
  return (
    <div className="sticky top-0 z-10 bg-background border-b p-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <SidebarTrigger variant="outline" />
        <h3 className="text-base">JavaScript Promise Polyfill Implementation</h3>
      </div>
      <div className="flex items-center">
        <UserButton showName />
      </div>
    </div>
  );
};
