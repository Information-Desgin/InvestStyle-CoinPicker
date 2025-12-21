import { COINS } from "../../data/coins";
import { useSelectedCoins } from "../../store/useSelectedCoins";
import ChainCoin from "./ChainCoin";
import type { InvestStyle } from "../../types/chainCoinList";

interface ChainCoinListProps {
  metrics?: Record<string, any>;
  sort?: InvestStyle | "marketCap";
}

export default function ChainCoinList({
  metrics = {},
  sort = "stable",
}: ChainCoinListProps) {
  const { selectedIds, toggle } = useSelectedCoins();

  const dist = (internal: number, external: number, ax: number, ay: number) => {
    const dx = internal - ax;
    const dy = external - ay;
    return dx * dx + dy * dy;
  };

  const coinList = Object.entries(COINS)
    .map(([key, coin]) => {
      const m = metrics[key];

      return {
        id: key,
        name: coin.name,
        coin: coin.symbol,
        chain: coin.chain,
        coinImg: coin.image,

        summary: m
          ? {
              marketCap: m.marketCapAvg,
              internal: m.internalAvg,
              external: m.externalAvg,
              netflow: m.netflowAvg,
            }
          : null,

        stats: m
          ? {
              endo: m.internalAvg * 100,
              exter: m.externalAvg * 100,
              netflow: ((m.netflowAvg + 1) / 2) * 100,
            }
          : { endo: 0, exter: 0, netflow: 50 },
      };
    })
    .sort((a, b) => {
      const A = a.summary;
      const B = b.summary;
      if (!A || !B) return 0;

      switch (sort) {
        case "marketCap":
          return B.marketCap - A.marketCap;

        case "stable":
          // 우상단 (1,1)
          return (
            dist(A.internal, A.external, 1, 1) -
            dist(B.internal, B.external, 1, 1)
          );

        case "neutral":
          // 좌상단 (0,1)
          return (
            dist(A.internal, A.external, 0, 1) -
            dist(B.internal, B.external, 0, 1)
          );

        case "cautious":
          // 우하단 (1,0)
          return (
            dist(A.internal, A.external, 1, 0) -
            dist(B.internal, B.external, 1, 0)
          );

        case "aggressive":
          // 좌하단 (0,0)
          return (
            dist(A.internal, A.external, 0, 0) -
            dist(B.internal, B.external, 0, 0)
          );

        default:
          return 0;
      }
    });

  return (
    <div className="flex flex-col gap-[14px] w-full">
      {coinList.map((item) => (
        <ChainCoin
          key={item.id}
          name={item.chain}
          coin={item.coin}
          color={COINS[item.id]?.color || "var(--point)"}
          coinImg={item.coinImg}
          isSelected={selectedIds.includes(item.id)}
          onClick={() => toggle(item.id)}
          stats={item.stats}
          summary={item.summary}
        />
      ))}
    </div>
  );
}
