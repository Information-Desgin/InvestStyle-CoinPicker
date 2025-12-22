import type { BaseInfoRow } from "../types/csvData";
import type { DailyFlowAgg } from "../types/netflow";
import type { ExternalStabilitySeries } from "../types/externalStability";
import { CHAIN_TO_COIN_ID } from "../utils/coinMap";
import { COINS } from "../data/coins";
import { mean } from "./stats";

const EPS = 1e-12;

/* ================================
   Pearson Correlation
================================ */
export function pearsonCorr(x: number[], y: number[]) {
  if (x.length !== y.length || x.length < 2) return null;

  const mx = mean(x);
  const my = mean(y);
  if (mx === null || my === null) return null;

  let num = 0,
    sx = 0,
    sy = 0;

  for (let i = 0; i < x.length; i++) {
    const dx = x[i] - mx;
    const dy = y[i] - my;
    num += dx * dy;
    sx += dx * dx;
    sy += dy * dy;
  }

  const denom = Math.sqrt(sx * sy);
  if (denom < EPS) return null;

  return num / denom;
}

/* ================================
   External Stability Builder ㄴ
================================ */
export function buildExternalStabilitySeries(
  baseInfo: BaseInfoRow[],
  dailyAgg: DailyFlowAgg[],
  window: number,
  range?: { start: string; end: string }
): ExternalStabilitySeries[] {
  if (!baseInfo || baseInfo.length === 0) return [];

  /* ---------- X축 ---------- */
  const allDates = Array.from(new Set(baseInfo.map((r) => r.date))).sort();
  const targetDates = range
    ? allDates.filter((d) => d >= range.start && d <= range.end)
    : allDates;

  /* ---------- 2. IBC volume map ---------- */
  const ibcByChain = new Map<string, Map<string, number>>();
  dailyAgg.forEach((row) => {
    const chain = row.chain.toLowerCase();
    if (!ibcByChain.has(chain)) ibcByChain.set(chain, new Map());
    ibcByChain.get(chain)!.set(row.date, row.inflow + row.outflow);
  });

  /* ---------- 3. Price map ---------- */
  const priceByChain = new Map<string, Map<string, number>>();
  baseInfo.forEach((row) => {
    const chain = row.chain.toLowerCase();
    if (!priceByChain.has(chain)) priceByChain.set(chain, new Map());
    priceByChain.get(chain)!.set(row.date, row.marketPrice);
  });

  const result: ExternalStabilitySeries[] = [];

  /* =================================================
     Chain loop
  ================================================= */
  for (const [chain, priceMap] of priceByChain) {
    const volMap = ibcByChain.get(chain) || new Map();

    const avgVol = mean(Array.from(volMap.values())) ?? 100;

    /* ---------- 4. Return & volume time series ---------- */
    const retMap = new Map<string, number>();
    const volMapData = new Map<string, number>();

    let lastPrice: number | null = null;

    allDates.forEach((date, i) => {
      const currPrice = priceMap.get(date);
      const effectivePrice = currPrice ?? lastPrice ?? 0;
      const prevPrice = lastPrice ?? effectivePrice;

      const ret =
        lastPrice !== null && prevPrice !== 0
          ? ((effectivePrice - prevPrice) / prevPrice) * 100
          : 0;

      const vol = volMap.get(date) ?? avgVol + (i % 2 === 0 ? 0.0001 : -0.0001);

      retMap.set(date, ret);
      volMapData.set(date, vol);

      if (currPrice !== undefined) lastPrice = currPrice;
    });

    /* ---------- 5. Raw stability ---------- */
    const rawStabilityMap = new Map<string, number>();

    allDates.forEach((date, i) => {
      const sliceDates = allDates.slice(Math.max(0, i - window + 1), i + 1);

      if (sliceDates.length < window) return;

      const rets = sliceDates.map((d) => retMap.get(d) ?? 0);
      const vols = sliceDates.map((d) => volMapData.get(d) ?? 0);

      const corr = pearsonCorr(rets, vols);
      const stability = corr === null || isNaN(corr) ? 0.5 : 1 - Math.abs(corr);

      rawStabilityMap.set(date, stability);
    });

    /* ---------- 6. Points (forward fill + MA) ---------- */
    const points: { date: string; value: number }[] = [];
    const maWindow = 3;
    let lastValue: number | null = null;

    targetDates.forEach((date) => {
      const dateIdx = allDates.indexOf(date);
      const maPool: number[] = [];

      for (let j = 0; j < maWindow; j++) {
        const d = allDates[dateIdx - j];
        const v = d ? rawStabilityMap.get(d) : undefined;
        if (v !== undefined) maPool.push(v);
      }

      let value: number | null = null;

      if (maPool.length > 0) {
        value = mean(maPool) ?? lastValue;
      } else {
        value = lastValue;
      }

      if (value === null) return;

      points.push({ date, value });
      lastValue = value;
    });

    const coinId = CHAIN_TO_COIN_ID[chain];
    if (coinId && points.length > 0) {
      result.push({
        id: coinId,
        color: COINS[coinId as keyof typeof COINS]?.color ?? "#888",
        points,
      });
    }
  }

  return result;
}
