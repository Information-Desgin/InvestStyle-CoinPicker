// 날짜·체인별 inflow / outflow 집계용
export type DailyFlowAgg = {
  date: string;
  chain: string;
  inflow: number;
  outflow: number;
};

// 정규화된 netflow
export type DailyNetFlow = {
  date: string;
  chain: string;
  netflow: number; // (-1 ~ 1)
};

// BoxPlot용
export type CapitalFlowPoint = {
  group: string; // coin
  value: number; // normalized netflow (-1 ~ 1)
};
