import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ConfirmDeleteChatModal = dynamic(
  () => import("./confirm-delete-chat-modal"),
);
const RenameChatModal = dynamic(() => import("./rename-chat-modal"));

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      {/* <ConfirmDeleteChatModal />
      <RenameChatModal /> */}
    </>
  );
};
