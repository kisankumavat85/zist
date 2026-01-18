import { UIMessage } from "ai";
import clsx from "clsx";
import { useMemo } from "react";

type Props = {
  message: UIMessage;
};

const Message = (props: Props) => {
  const { message } = props;

  const messageContent = useMemo(
    () =>
      message.parts
        .filter((p) => p.type === "text")
        .map((p) => p.text)
        .join(". "),
    [message.parts]
  );

  const isUser = useMemo(() => message.role === "user", [message.role]);

  return (
    <div
      className={clsx("p-3 rounded-md", {
        "self-start": !isUser,
        "self-end bg-accent text-accent-foreground": isUser,
      })}
    >
      {messageContent}
    </div>
  );
};

export default Message;
