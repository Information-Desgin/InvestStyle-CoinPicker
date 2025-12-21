import { stdDev } from "../stats";

export function calcPriceStability(prices: number[]): number {
  if (prices.length < 2) return 0;

  const returns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    const r = (prices[i] - prices[i - 1]) / prices[i - 1];
    returns.push(r);
  }

  const sigmaP = stdDev(returns);
  return 1 / (1 + sigmaP);
}
