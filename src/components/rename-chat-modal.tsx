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
import { updateChatTitle } from "@/actions/chats";
import { getQueryClient } from "@/providers";
import { toast } from "sonner";
import { ChangeEvent, useEffect, useState } from "react";
import { Spinner } from "./ui/spinner";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RenameChatModalData } from "@/hooks/use-modals";

export type RenameChatModalProps = {
  data: RenameChatModalData;
  onClose: () => void;
  isOpen: boolean;
};

const RenameChatModal = (props: RenameChatModalProps) => {
  const { data: chat, onClose, isOpen } = props;
  // const { data: chat, isOpen, onClose, type } = useModal();
  const [isChanging, setIsChanging] = useState(false);
  const [title, setTitle] = useState(() => chat?.title || "");

  // const open = isOpen && type === "rename-chat";

  useEffect(() => {
    if (chat?.title) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitle(chat.title);
    }
  }, [chat?.title]);

  if (!chat) return null;

  console.log("chat", chat);

  const handleChangeClick = async () => {
    const value = title.trim();
    if (!value) return;

    setIsChanging(true);
    const updatedChat = await updateChatTitle(value, chat.id);

    if (updatedChat.success) {
      onClose();
      const queryClient = getQueryClient();
      queryClient.invalidateQueries({
        queryKey: ["sidebar-chats"],
      });
      toast.success("Chat updated");
    }
    setIsChanging(false);
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
  };

  return (
    <Dialog open={isOpen} defaultOpen={false} onOpenChange={onClose}>
      <DialogContent className="max-w-90 sm:max-w-120 w-full gap-8">
        <DialogHeader>
          <DialogTitle>Rename chat</DialogTitle>
          <DialogDescription>
            Change the title of &quot;{chat.title}&quot; chat
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Title</Label>
          <Input name="title" value={title} onChange={handleTitleChange} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleChangeClick} disabled={isChanging || !title}>
            {isChanging && <Spinner />}
            Change
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RenameChatModal;
