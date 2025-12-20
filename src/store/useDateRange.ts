import { create } from "zustand";

type DateRangeState = {
  startDate: Date | null;
  endDate: Date | null;
  setDateRange: (start: Date | null, end: Date | null) => void;
  resetDateRange: () => void;
};

export const useDateRange = create<DateRangeState>((set) => ({
  startDate: null,
  endDate: null,
  setDateRange: (start, end) =>
    set({
      startDate: start,
      endDate: end,
    }),
  resetDateRange: () =>
    set({
      startDate: null,
      endDate: null,
    }),
}));
