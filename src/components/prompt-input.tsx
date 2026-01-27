"use client";

import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ArrowUp, Loader } from "lucide-react";
import { Card } from "./ui/card";
import ResourcesButton from "./resources-button";
import { SelectResource } from "@/db/schema";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { createChats } from "@/actions/chats";
import { toast } from "sonner";
import { getQueryClient } from "@/providers";

type Props = {
  initialResources: SelectResource[];
  resource?: SelectResource;
  newChat?: boolean;
  isLoading?: boolean;
  onSubmit?: (prompt: string) => void;
};

const PromptInput = (props: Props) => {
  const { initialResources, resource, newChat, onSubmit, isLoading } = props;
  const { userId } = useAuth();
  const searchParams = useSearchParams();
  const resourceId = searchParams.get("r") || resource?.id;
  const [prompt, setPrompt] = useState("");
  const router = useRouter();

  const onPromptSubmit = async (prompt: string) => {
    prompt = prompt.trim();

    if (!newChat && onSubmit) {
      setPrompt("");
      return onSubmit(prompt);
    }
    if (!resourceId || !userId) return;

    const result = await createChats([
      {
        resourceId: Number(resourceId),
        title: prompt.slice(0, 40) || "Untitled",
        userId,
      },
    ]);

    if (result.success) {
      const qc = getQueryClient();
      qc.invalidateQueries({
        queryKey: ["sidebar-chats"],
      });
      localStorage.setItem("prompt", prompt);
      router.push(`/chat/${result.chats[0].id}`);
    } else {
      toast(result.message);
    }
  };

  return (
    <Card className="p-4 gap-4 shadow-none w-full">
      <Textarea
        className="p-0 resize-none border-none rounded-none shadow-none ring-0 focus-visible:ring-0 dark:bg-transparent"
        placeholder="Ask anything..."
        onChange={(e) => setPrompt(e.target.value)}
        value={prompt}
      />
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ResourcesButton initialResources={initialResources} />
          <p>{resource?.name}</p>
        </div>
        <Button
          size="icon"
          disabled={!resourceId || (!prompt && !isLoading)}
          onClick={() => onPromptSubmit(prompt)}
        >
          {isLoading ? <Loader className="animate-spin" /> : <ArrowUp />}
        </Button>
      </div>
    </Card>
  );
};

export default PromptInput;
