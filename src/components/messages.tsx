import { UIMessage } from "ai";
import Message from "./message";

type Props = {
  messages: UIMessage[];
};

const Messages = (props: Props) => {
  const { messages } = props;

  return (
    <div className="flex flex-col gap-8 w-180">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
};

export default Messages;
