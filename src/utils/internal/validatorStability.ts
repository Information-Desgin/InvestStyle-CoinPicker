import { mean, stdDev } from "../stats";

export type ValidatorSnapshot = {
  active: number;
  total: number;
};

export function calcValidatorStability(data: ValidatorSnapshot[]): number {
  if (data.length === 0) return 0;

  const ratios = data.map((d) => (d.total === 0 ? 0 : d.active / d.total));

  const avg = mean(ratios);
  const sigma = stdDev(ratios);

  return avg / (1 + sigma);
}
