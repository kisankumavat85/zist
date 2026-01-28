import { SelectChat } from "@/db/schema";
import { create } from "zustand";

export type ModalName = "confirm-delete-chat" | "rename-chat";

export type ConfirmDeleteChatModalData = SelectChat;
export type RenameChatModalData = SelectChat;

type ModalData = ConfirmDeleteChatModalData | RenameChatModalData;

export type ModalInstance = {
  id: string;
  name: ModalName;
  data: ModalData;
};

type ModalStore = {
  modals: ModalInstance[];
  onOpen: (name: ModalName, data: ModalData) => void;
  onClose: (id: string) => void;
};

export const useModals = create<ModalStore>((set) => ({
  modals: [],
  onOpen: (name, data) => {
    const id = Math.random().toString().substring(2, 10);
    set((state) => ({
      modals: [...state.modals, { id, name, data }],
    }));
  },
  onClose: (id) => {
    set((state) => ({
      modals: state.modals.filter((modal) => modal.id !== id),
    }));
  },
  onCloseAll: () => set({ modals: [] }),
}));
