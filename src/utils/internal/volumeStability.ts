import { mean, stdDev } from "../stats";

export function calcVolumeStability(volumes: number[]): number {
  if (volumes.length === 0) return 0;

  const mu = mean(volumes);
  if (mu === 0) return 0;

  const sigma = stdDev(volumes);
  const cv = sigma / mu;

  return 1 / (1 + cv);
}
