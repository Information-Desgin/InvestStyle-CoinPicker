export type ExternalStabilityPoint = { date: string; value: number };
export type ExternalStabilitySeries = {
  id: string;
  color: string;
  points: ExternalStabilityPoint[];
};
