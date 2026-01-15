import { getResources } from "@/actions/resources";
import PromptInput from "@/components/prompt-input";
import { auth } from "@clerk/nextjs/server";

type Props = { params: Promise<{ id: string }> };

const ActiveChatPage = async (props: Props) => {
  const { params } = props;
  const { id } = await params;
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();
  const resources = await getResources({ userId, limit: 5 });

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex-1">
        <h1 className="text-3xl">{id}</h1>
      </div>
      <div className="">
        <PromptInput initialResources={resources} />
      </div>
    </div>
  );
};

export default ActiveChatPage;
