"use client";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ArrowUp } from "lucide-react";
import { Card } from "./ui/card";
import ResourcesButton from "./resources-button";
import { SelectResource } from "@/db/schema";
import { useEffect, useState, useTransition } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "./ui/spinner";
import { useChat } from "@ai-sdk/react";
import { createQueryString } from "@/utils/search-params";
import { toast } from "sonner";
import { getResources } from "@/actions/resources";
import { insertChats } from "@/actions/chats";

type Props = {
  initialResources: SelectResource[];
};

const PromptInput = (props: Props) => {
  const { initialResources } = props;
  const [resource, setResource] = useState<SelectResource | null>(null);
  const [isPending, startTransition] = useTransition();
  const { userId } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const resourceId = searchParams.get("r");
  const [prompt, setPrompt] = useState("");

  const { messages, sendMessage } = useChat({
    onError: (error) => {
      toast(error.message);
    },
  });
  console.log('messages', messages)

  useEffect(() => {
    if (resourceId && userId) {
      const foundResource = initialResources.find(
        (item) => item.id === Number(resourceId)
      );
      if (foundResource) {
        setResource(foundResource);
      } else {
        startTransition(async () => {
          const resource = await getResources({
            userId,
            limit: 1,
            id: Number(resourceId),
          });
          setResource(resource[0]);
        });
      }
    }
  }, [initialResources, resourceId, userId]);

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

  const onPromptSubmit = async (prompt: string) => {
    prompt = prompt.trim();

    if (!resourceId || !userId) return;

    const [chat] = await insertChats([
      {
        resourceId: Number(resourceId),
        title: prompt.slice(0, 40),
        userId,
      },
    ]);
    const body = {
      chatId: chat.id,
      userId,
      resourceId,
    };
    sendMessage({ text: prompt }, { body });
  };

  return (
    <Card className="w-full p-4 gap-4 shadow-none">
      <Textarea
        className="p-0 text-2xl resize-none border-none shadow-none ring-0 focus-visible:ring-0 dark:bg-transparent"
        placeholder="Ask anything about files"
        onChange={(e) => setPrompt(e.target.value)}
      />
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ResourcesButton
            initialResources={initialResources}
            onSelect={onResourceSelect}
          />
          {isPending ? <Spinner /> : resource?.name}
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
