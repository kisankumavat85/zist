"use client";

import { useState, useTransition } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { File, Files, Paperclip, Plus } from "lucide-react";
import { SelectResource } from "@/db/schema";
import { selectResource } from "@/db/query/resources";
import { useAuth } from "@clerk/clerk-react";
import Link from "next/link";

type Props = {
  initialResources: SelectResource[];
  onSelect: (id: number) => void;
};

const ResourcesButton = (props: Props) => {
  const { initialResources, onSelect } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [resources, setResources] = useState(initialResources);
  const [isPending, startTransition] = useTransition();
  const { userId } = useAuth();

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && initialResources?.length === 0 && userId) {
      startTransition(async () => {
        const resources = await selectResource({ userId });
        setResources(resources);
      });
    }
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange} open={isOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Paperclip /> Resources
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" className="max-w-80">
        <DropdownMenuLabel>Latest resources</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isPending ? (
          <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
        ) : resources?.length ? (
          resources?.map((resource) => (
            <DropdownMenuItem
              key={resource.id}
              onSelect={() => onSelect(resource.id)}
              asChild
            >
              <Link href={`/chat?r=${resource.id}`} className="">
                <File />
                <span className="truncate">{resource.name}</span>
              </Link>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>No resources found</DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/resources">
            <Plus />
            Add resource
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/resources">
            <Files />
            All Resources
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ResourcesButton;
