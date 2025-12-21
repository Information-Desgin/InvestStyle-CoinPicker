import type { RelayerFlowRow } from "../types/csvData";
import type { CapitalFlowPoint, DailyFlowAgg } from "../types/netflow";
import type { DailyNetFlow } from "../types/netflow";
import { CHAIN_TO_COIN_ID } from "./coinMap";

/**
 * 날짜 + 체인별 inflow / outflow 집계
 */
export function aggregateDailyFlows(flows: RelayerFlowRow[]): DailyFlowAgg[] {
  const map = new Map<string, { inflow: number; outflow: number }>();

  flows.forEach(({ date, source, target, outflow_usd }) => {
    const sourceKey = `${date}|${source}`;
    const targetKey = `${date}|${target}`;

    if (!map.has(sourceKey)) map.set(sourceKey, { inflow: 0, outflow: 0 });
    if (!map.has(targetKey)) map.set(targetKey, { inflow: 0, outflow: 0 });

    map.get(sourceKey)!.outflow += outflow_usd;
    map.get(targetKey)!.inflow += outflow_usd;
  });

  return Array.from(map.entries()).map(([key, v]) => {
    const [date, chain] = key.split("|");
    return { date, chain, ...v };
  });
}

/**
 * 정규화 NetFlow 계산
 * (inflow - outflow) / (inflow + outflow)
 */
export function normalizeDailyNetFlow(daily: DailyFlowAgg[]): DailyNetFlow[] {
  return daily.map(({ date, chain, inflow, outflow }) => {
    const denom = inflow + outflow;
    const netflow = denom === 0 ? 0 : (inflow - outflow) / denom;

    return { date, chain, netflow };
  });
}

/**
 * DailyNetFlow → BoxPlot용 데이터
 */
export function buildNetFlowPoints(
  daily: { chain: string; netflow: number }[]
): CapitalFlowPoint[] {
  return daily
    .map(({ chain, netflow }) => {
      const coinId = CHAIN_TO_COIN_ID[chain.toLowerCase()];
      if (!coinId) return null;

      return {
        group: coinId,
        value: netflow,
      };
    })
    .filter(Boolean) as CapitalFlowPoint[];
}
