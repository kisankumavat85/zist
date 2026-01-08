import PromptInput from "@/components/prompt-input";

type Props = { params: Promise<{ id: string }> };

const ActiveChatPage = async (props: Props) => {
  const { params } = props;
  const { id } = await params;

  return (
    <div className="flex flex-col gap-4 border border-red-300 h-full">
      <div className="flex-1">
        <h1 className="text-3xl">{id}</h1>
      </div>
      <div className="">
        <PromptInput />
      </div>
    </div>
  );
};

export default ActiveChatPage;
