import { SelectChat } from "@/db/schema";
import { create } from "zustand";

type ModalType = "confirm-delete-chat" | "rename-chat";

type ConfirmDeleteChatModalData = SelectChat;
type RenameChatModalData = SelectChat;

type ModalStore = {
  type: ModalType | null;
  data: ConfirmDeleteChatModalData | RenameChatModalData | null;
  isOpen: boolean;
  onOpen: (type: ModalType, data: ConfirmDeleteChatModalData) => void;
  onClose: () => void;
};

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: null,
  isOpen: false,
  onOpen: (type, data) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null, data: null }),
}));
