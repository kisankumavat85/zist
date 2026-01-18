"use client";

import PromptInput from "@/components/prompt-input";
import { SelectResource } from "@/db/schema";

type Props = {
  initialResources: SelectResource[];
  selectedResource?: SelectResource;
};

const Chat = (props: Props) => {
  const { initialResources, selectedResource } = props;

  return (
    <div className="flex flex-col h-full justify-center w-180">
      <div className="mb-4">
        <h1 className="text-xl">Hi, Kisan</h1>
        <h1 className="text-3xl font-bold">Ready when you are</h1>
      </div>
      <PromptInput
        initialResources={initialResources}
        resource={selectedResource}
        newChat
      />
    </div>
  );
};

export default Chat;
