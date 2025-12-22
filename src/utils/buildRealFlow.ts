import { COINS } from "../data/coins";
import { CHAIN_TO_COIN_ID } from "./coinMap";
import type { RelayerFlowRow } from "../types/csvData";

export type RealFlow = {
  keys: string[];
  matrix: number[][];
};

export function buildRealFlows(flows: RelayerFlowRow[]): RealFlow {
  const keys = Object.keys(COINS); // ["atom", "osmo", ...]
  const indexMap = new Map<string, number>();

  keys.forEach((k, i) => indexMap.set(k, i));

  const matrix = Array.from({ length: keys.length }, () =>
    Array(keys.length).fill(0)
  );

  const transformVolume = (v: number) => {
    const MAX = 1_000_000; // ⭐ COSMOS 억제용
    return Math.sqrt(Math.min(v, MAX));
  };

  flows.forEach((row) => {
    const sourceId = CHAIN_TO_COIN_ID[row.source.toLowerCase()];
    const targetId = CHAIN_TO_COIN_ID[row.target.toLowerCase()];
    if (!sourceId || !targetId) return;

    const i = indexMap.get(sourceId);
    const j = indexMap.get(targetId);
    if (i == null || j == null) return;

    const raw = Number(row.outflow_usd);
    if (!Number.isFinite(raw) || raw <= 0) return;

    matrix[i][j] += transformVolume(raw);
  });

  return { keys, matrix };
}
