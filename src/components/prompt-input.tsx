"use client";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { Card } from "./ui/card";
import ResourcesButton from "./resources-button";
import { SelectResource } from "@/db/schema";
import { useEffect, useState, useTransition } from "react";
import { useAuth } from "@clerk/nextjs";
import { selectResource } from "@/db/query/resources";
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "./ui/spinner";

type Props = {
  initialResources: SelectResource[];
};

const createQueryString = ({
  searchParams,
  name,
  value,
}: {
  searchParams: URLSearchParams;
  name: string;
  value: string;
}) => {
  const _searchParams = new URLSearchParams(searchParams.toString());
  _searchParams.set(name, value);
  return _searchParams.toString();
};

const PromptInput = (props: Props) => {
  const { initialResources } = props;
  const [resource, setResource] = useState<SelectResource | null>(null);
  const [isPending, startTransition] = useTransition();
  const { userId } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const resourceId = searchParams.get("r");
    if (resourceId && userId) {
      const foundResource = initialResources.find(
        (item) => item.id === Number(resourceId)
      );
      if (foundResource) {
        setResource(foundResource);
      } else {
        startTransition(async () => {
          const resource = await selectResource({
            userId,
            limit: 1,
            id: Number(resourceId),
          });
          setResource(resource[0]);
        });
      }
    }
  }, [initialResources, searchParams, userId]);

  const onResourceSelect = (id: number) => {
    if (id) {
      const queryString = createQueryString({
        searchParams,
        name: "r",
        value: String(id),
      });
      router.push("/chat" + "?" + queryString);
    }
  };

  return (
    <Card className="w-full p-6 gap-2">
      <Textarea
        className="text-2xl resize-none"
        placeholder="Ask anything about files"
      />
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ResourcesButton
            initialResources={initialResources}
            onSelect={onResourceSelect}
          />
          {isPending ? <Spinner /> : resource?.name}
        </div>
        <Button size="icon">
          <Send />
        </Button>
      </div>
    </Card>
  );
};

export default PromptInput;
