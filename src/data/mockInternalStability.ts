export type InternalStabilityBarItem = {
  coin: string;
  onchain: number;
  active: number;
  staking: number;
  price: number;
  validator: number;
};

export function generateDummyInternalStability(
  coinIds: string[]
): InternalStabilityBarItem[] {
  return coinIds.map((id) => ({
    coin: id,
    onchain: Number((Math.random() * 1).toFixed(2)),
    active: Number((Math.random() * 1).toFixed(2)),
    staking: Number((Math.random() * 1).toFixed(2)),
    price: Number((Math.random() * 1).toFixed(2)),
    validator: Number((Math.random() * 1).toFixed(2)),
  }));
}
