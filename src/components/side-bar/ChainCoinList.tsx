import { COINS } from "../../data/coins";
import { useSelectedCoins } from "../../store/useSelectedCoins";
import ChainCoin from "./ChainCoin";
import type { InvestStyle } from "../../types/chainCoinList";

interface ChainCoinListProps {
  metrics?: Record<string, any>;
  sort?: InvestStyle;
}

export default function ChainCoinList({
  metrics = {},
  sort = "stable",
}: ChainCoinListProps) {
  const { selectedIds, toggle } = useSelectedCoins();

  const coinList = Object.entries(COINS)
    .map(([key, coin]) => {
      const m = metrics[key];

      return {
        id: key,
        name: coin.name,
        coin: coin.symbol,
        chain: coin.chain,
        coinImg: coin.image,

        // raw summary (정렬 & tooltip 용)
        summary: m
          ? {
              marketCap: m.marketCapAvg,
              internal: m.internalAvg,
              external: m.externalAvg,
              netflow: m.netflowAvg,
            }
          : null,

        // bar용 (0~100)
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
          return B.internal + B.external - (A.internal + A.external);

        case "cautious":
          return B.internal - B.external - (A.internal - A.external);

        case "aggressive":
          return A.internal + A.external - (B.internal + B.external);

        case "neutral":
          return B.external - B.internal - (A.external - A.internal);

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
