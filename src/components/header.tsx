import { Files } from "lucide-react";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";
import Link from "next/link";

export const Header = () => {
  return (
    <div className="border-b p-4 flex justify-between items-center">
      <div className="">
        <SidebarTrigger variant="outline" />
        <h3></h3>
      </div>
      <div className="">
        <Button variant="link" asChild>
          <Link href="/data">Data Sources</Link>
        </Button>
      </div>
    </div>
  );
};
