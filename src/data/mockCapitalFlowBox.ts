export type CapitalFlowBox = {
  group: string;
  value: number;
};

export function generateDummyCapitalFlowBox(
  coinIds: string[],
  sampleCount = 20
): CapitalFlowBox[] {
  const result: CapitalFlowBox[] = [];

  coinIds.forEach((coin) => {
    for (let i = 0; i < sampleCount; i++) {
      result.push({
        group: coin,
        value: Number((Math.random() * 2 - 1).toFixed(2)), // -1 ~ 1
      });
    }
  });

  return result;
}
