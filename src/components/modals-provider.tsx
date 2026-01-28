import { ComponentType, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ModalName, useModals } from "@/hooks/use-modals";
import { ConfirmDeleteChatModalProps } from "./confirm-delete-chat-modal";
import { RenameChatModalProps } from "./rename-chat-modal";

const ConfirmDeleteChatModal = dynamic<ConfirmDeleteChatModalProps>(
  () => import("./confirm-delete-chat-modal"),
);
const RenameChatModal = dynamic<RenameChatModalProps>(
  () => import("./rename-chat-modal"),
);

const modalComponents: Record<
  ModalName,
  ComponentType<ConfirmDeleteChatModalProps | RenameChatModalProps>
> = {
  "confirm-delete-chat": ConfirmDeleteChatModal,
  "rename-chat": RenameChatModal,
};

export const ModalsProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { modals, onClose } = useModals();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      {modals.map(({ id, name, data }) => {
        const Component = modalComponents[name];
        return (
          <Component
            key={id}
            data={data}
            onClose={() => onClose(id)}
            isOpen={true}
          />
        );
      })}
    </>
  );
};
