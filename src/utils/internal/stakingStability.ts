import { mean, stdDev } from "../stats";

export type StakingSnapshot = {
  bonded: number;
  supply: number;
};

export function calcStakingStability(data: StakingSnapshot[]): number {
  if (data.length === 0) return 0;

  const ratios = data.map((d) => (d.supply === 0 ? 0 : d.bonded / d.supply));

  const avg = mean(ratios);
  const sigma = stdDev(ratios);

  return avg / (1 + sigma);
}
