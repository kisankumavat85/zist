"use client";

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
import Link from "next/link";
import { createQueryString } from "@/utils/search-params";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  initialResources: SelectResource[];
};

const ResourcesButton = (props: Props) => {
  const { initialResources = [] } = props;
  const searchParams = useSearchParams();
  const router = useRouter();

  const onResourceSelect = (id: number) => {
    if (id) {
      const queryString = createQueryString({
        searchParams,
        name: "r",
        value: String(id),
      });
      const pathname = window.location.pathname;
      const href = pathname + "?" + queryString;

      router.push(href);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Paperclip />
          Resources
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="end" className="max-w-80">
        <DropdownMenuLabel>Latest resources</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {initialResources.length ? (
          initialResources.map((resource) => (
            <DropdownMenuItem
              key={resource.id}
              onSelect={() => onResourceSelect(resource.id)}
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
