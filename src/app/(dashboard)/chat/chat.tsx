"use client";

import PromptInput from "@/components/prompt-input";
import ResourceUploader from "@/components/resource-uploader";
import { SelectResource } from "@/db/schema";
import { createQueryString } from "@/utils/search-params";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  initialResources: SelectResource[];
  selectedResource?: SelectResource;
};

const Chat = (props: Props) => {
  const { initialResources, selectedResource } = props;
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleOnSuccess = (resource: SelectResource) => {
    router.push(
      "/chat" +
        "?" +
        createQueryString({
          searchParams,
          name: "r",
          value: resource.id.toString(),
        })
    );
  };

  return (
    <div className="flex flex-col gap-4 h-full justify-center w-180">
      <div className="mb-4">
        <h1 className="text-4xl font-semibold text-center">
          Chat with {selectedResource?.name || "Document"}
        </h1>
      </div>
      {selectedResource ? (
        <PromptInput
          initialResources={initialResources}
          resource={selectedResource}
          newChat
        />
      ) : (
        <ResourceUploader onSuccess={handleOnSuccess} />
      )}
    </div>
  );
};

export default Chat;
