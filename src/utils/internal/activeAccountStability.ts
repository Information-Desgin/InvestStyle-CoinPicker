import { mean, stdDev } from "../stats";

export function calcActiveAccountStability(activeAccounts: number[]): number {
  if (activeAccounts.length === 0) return 0;

  const mu = mean(activeAccounts);
  if (mu === 0) return 0;

  const sigma = stdDev(activeAccounts);
  const cv = sigma / mu;

  return 1 / (1 + cv);
}
