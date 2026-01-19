"use client";

import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ArrowUp } from "lucide-react";
import { Card } from "./ui/card";
import ResourcesButton from "./resources-button";
import { SelectResource } from "@/db/schema";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { createChats } from "@/actions/chats";

type Props = {
  initialResources: SelectResource[];
  resource?: SelectResource;
  newChat?: boolean;
  onSubmit?: (prompt: string) => void;
};

const PromptInput = (props: Props) => {
  const { initialResources, resource, newChat, onSubmit } = props;
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

    const [chat] = await createChats([
      {
        resourceId: Number(resourceId),
        title: prompt.slice(0, 40) || "Untitled",
        userId,
      },
    ]);

    localStorage.setItem("prompt", prompt);

    router.push(`/chat/${chat.id}`);
  };

  return (
    <Card className="p-4 gap-4 shadow-none max-w-180 min-w-full">
      <Textarea
        className="p-0 resize-none border-none rounded-none shadow-none ring-0 focus-visible:ring-0 dark:bg-transparent"
        placeholder="Ask anything..."
        onChange={(e) => setPrompt(e.target.value)}
      />
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ResourcesButton initialResources={initialResources} />
          <p>{resource?.name}</p>
        </div>
        <Button
          size="icon"
          disabled={!resourceId || !prompt}
          onClick={() => onPromptSubmit(prompt)}
        >
          <ArrowUp />
        </Button>
      </div>
    </Card>
  );
};

export default PromptInput;
