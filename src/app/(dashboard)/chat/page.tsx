import { getResources } from "@/actions/resources";
import PromptInput from "@/components/prompt-input";
import { auth } from "@clerk/nextjs/server";

const ChatPage = async () => {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();
  const resources = await getResources({ userId, limit: 5 });

  return (
    <div className="h-full flex justify-center items-center">
      <div className="flex flex-col w-full h-full justify-center">
        <div className="mb-4">
          <h1 className="text-xl">Hi, Kisan</h1>
          <h1 className="text-3xl font-bold">Ready when you are</h1>
        </div>
        <PromptInput initialResources={resources} />
      </div>
    </div>
  );
};

export default ChatPage;
