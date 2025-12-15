export type ExternalStabilitySeries = {
  id: string;
  color: string;
  values: {
    timestamp: string;
    value: number;
  }[];
};

export function generateDummyExternalStability(
  coins: { id: string; color: string }[],
  months = 12
): ExternalStabilitySeries[] {
  const dates: string[] = [];
  const today = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setMonth(today.getMonth() - i);
    dates.push(d.toISOString().slice(0, 10));
  }

  return coins.map((coin) => {
    let base = Math.random() * 0.4 + 0.3; // 0.3~0.7

    return {
      id: coin.id,
      color: coin.color,
      values: dates.map((date) => {
        base += (Math.random() - 0.5) * 0.12;
        base = Math.max(0.05, Math.min(0.95, base));

        return {
          timestamp: date,
          value: Number(base.toFixed(2)),
        };
      }),
    };
  });
}
