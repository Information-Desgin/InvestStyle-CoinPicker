import { COINS } from "../../data/coins";
import { useSelectedCoins } from "../../store/useSelectedCoins";
import ChainCoin from "./ChainCoin";
import type { InvestStyle } from "../../types/chainCoinList";

interface ChainCoinListProps {
  metrics?: Record<string, any>;
  sort?: InvestStyle | "marketCap";
}

const amplify = (v: number, factor = 1.8) =>
  Math.max(0, Math.min(100, 50 + (v - 50) * factor));

const ANCHOR = {
  stable: [100, 100],
  neutral: [0, 100],
  cautious: [100, 0],
  aggressive: [0, 0],
} as const;

const score = (
  internal01: number,
  external01: number,
  ax: number,
  ay: number
) => {
  const internal = amplify(internal01 * 100);
  const external = amplify(external01 * 100);

  const dx = internal - ax;
  const dy = external - ay;
  return dx * dx + dy * dy;
};

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

      if (sort === "marketCap") {
        return B.marketCap - A.marketCap;
      }

      const [ax, ay] = ANCHOR[sort];

      return (
        score(A.internal, A.external, ax, ay) -
        score(B.internal, B.external, ax, ay)
      );
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
