import { create } from "zustand";

type SelectedCoinStore = {
  selectedIds: string[];
  toggle: (id: string) => void;
  reset: () => void;
};

export const useSelectedCoins = create<SelectedCoinStore>((set) => ({
  selectedIds: [],

  toggle: (id) =>
    set((state) => {
      const exists = state.selectedIds.includes(id);
      return {
        selectedIds: exists
          ? state.selectedIds.filter((s) => s !== id)
          : [...state.selectedIds, id],
      };
    }),

  reset: () => set({ selectedIds: [] }),
}));
