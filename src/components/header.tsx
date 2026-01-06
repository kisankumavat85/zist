import { SidebarTrigger } from "./ui/sidebar";

export const Header = () => {
  return (
    <div className="border-b p-4">
      <SidebarTrigger variant="outline" />
      <h3></h3>
    </div>
  );
};
