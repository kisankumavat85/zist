import PromptInput from "@/components/prompt-input";

const HAVE_OTHER_CONTENT = true;

const ChatPage = () => {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col h-full justify-center">
        {HAVE_OTHER_CONTENT && <div className="chat chat"></div>}
        <div className="">
          <div className="mb-4">
            <h1 className="text-xl">Hi, Kisan</h1>
            <h1 className="text-3xl font-bold">Ready when you are</h1>
          </div>
          <PromptInput />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
