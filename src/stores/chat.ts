import { create } from "zustand";

type ChatState = {
  open: boolean;
  toggle: () => void;
  setOpen: (open: boolean) => void;
};

export const useChatStore = create<ChatState>((set) => ({
  open: false,
  toggle: () => set((s) => ({ open: !s.open })),
  setOpen: (open) => set({ open }),
}));
