"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { deleteChat } from "@/actions/chats";
import { getQueryClient } from "@/providers";
import { toast } from "sonner";
import { useState } from "react";
import { Spinner } from "./ui/spinner";
import { ConfirmDeleteChatModalData } from "@/hooks/use-modals";

export type ConfirmDeleteChatModalProps = {
  data: ConfirmDeleteChatModalData;
  onClose: () => void;
  isOpen: boolean;
};

const ConfirmDeleteChatModal = (props: ConfirmDeleteChatModalProps) => {
  const { data: chat, isOpen, onClose } = props;
  // const { data: chat, isOpen, onClose, type } = useModal();
  const [deleting, setDeleting] = useState(false);

  if (!chat) return null;

  const handleDeleteClick = async () => {
    setDeleting(true);
    const deletedChat = await deleteChat(chat.id);

    if (deletedChat) {
      onClose();
      const queryClient = getQueryClient();
      queryClient.invalidateQueries({
        queryKey: ["sidebar-chats"],
      });
      toast.success("Chat deleted");
    }

    setDeleting(false);
  };

  return (
    <Dialog open={isOpen} defaultOpen={false} onOpenChange={onClose}>
      <DialogContent className="max-w-90 sm:max-w-120 w-full">
        <DialogHeader>
          <DialogTitle>Delete chat</DialogTitle>
          <DialogDescription>
            Do you want to delete &quot;{chat.title}&quot; chat?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteClick}
            disabled={deleting}
          >
            {deleting && <Spinner />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteChatModal;
