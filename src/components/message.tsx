import { UIMessage } from "ai";
import clsx from "clsx";
import { ChatSpace } from "./chat-space";

type Props = {
  message: UIMessage;
  isLastUserMessage?: boolean;
};

const Message = (props: Props) => {
  const { message, isLastUserMessage } = props;

  const messageContent = message.parts
    .filter((p) => p.type === "text")
    .map((p) => p.text)
    .join(". ");

  const isUser = message.role === "user";
  const id = isUser ? `user-${message.id}` : `assistant-${message.id}`;

  return (
    <div id={id} className="mb-4">
      {isLastUserMessage && <ChatSpace />}
      <div
        className={clsx("flex", {
          "justify-end": isUser,
        })}
      >
        <div
          className={clsx("p-3 rounded-md", {
            "bg-accent text-accent-foreground max-w-[70%]": isUser,
            "w-full": !isUser,
          })}
        >
          {messageContent}
        </div>
      </div>
    </div>
  );
};

export default Message;
