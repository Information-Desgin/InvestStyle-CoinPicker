import { create } from "zustand";

export interface AnalyticsSummary {
  coinId: string;
  internalAvg: number;
  externalAvg: number;
  netflowAvg: number;
  marketCapAvg: number;
}

interface State {
  summaries: Record<string, AnalyticsSummary>;
  setSummary: (coinId: string, summary: AnalyticsSummary) => void;
  reset: () => void;
}

export const useAnalyticsSummary = create<State>((set) => ({
  summaries: {},
  setSummary: (coinId, summary) =>
    set((state) => ({
      summaries: { ...state.summaries, [coinId]: summary },
    })),
  reset: () => set({ summaries: {} }),
}));
