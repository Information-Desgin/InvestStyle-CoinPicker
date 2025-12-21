export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function stdDev(values: number[]): number {
  if (values.length === 0) return 0;
  const m = mean(values);
  const variance =
    values.reduce((sum, v) => sum + Math.pow(v - m, 2), 0) / values.length;
  return Math.sqrt(variance);
}
