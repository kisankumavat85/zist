import { UIMessage } from "ai";
import clsx from "clsx";
import Markdown from "react-markdown";
import { ChatSpace } from "./chat-space";

type Props = {
  message: UIMessage;
  isLastUserMessage?: boolean;
};

const Message = (props: Props) => {
  const { message, isLastUserMessage } = props;

  const textParts = message.parts.filter((p) => p.type === "text");

  const isUser = message.role === "user";
  const id = isUser ? `user-${message.id}` : `assistant-${message.id}`;

  return (
    <div id={id} className="my-2">
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
          {textParts.map((part, index) =>
            isUser ? (
              <p key={index}>{part.text}</p>
            ) : (
              <div key={index} className="prose dark:prose-invert">
                <Markdown>{part.text}</Markdown>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
