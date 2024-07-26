import { create } from "zustand";

interface useSiteModalSite {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useSiteModal = create<useSiteModalSite>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
