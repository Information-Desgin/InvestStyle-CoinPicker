import { COINS } from "../../data/coins";
import { useSelectedCoins } from "../../store/useSelectedCoins";
import ChainCoin from "./ChainCoin";

export default function ChainCoinList({ metrics = {} }) {
  const { selectedIds, toggle } = useSelectedCoins();

  const coinList = Object.entries(COINS).map(([key, coin]) => {
    const m = metrics[key];

    return {
      id: key,
      name: coin.name,
      coin: coin.symbol,
      chain: coin.chain,
      coinImg: coin.image,

      // bar용 (0~100)
      stats: m
        ? {
            endo: m.internalAvg * 100,
            exter: m.externalAvg * 100,
            netflow: ((m.netflowAvg + 1) / 2) * 100,
          }
        : { endo: 0, exter: 0, netflow: 50 },

      // Tooltip용 (raw)
      summary: m
        ? {
            marketCap: m.marketCapAvg,
            internal: m.internalAvg,
            external: m.externalAvg,
            netflow: m.netflowAvg,
          }
        : null,
    };
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
