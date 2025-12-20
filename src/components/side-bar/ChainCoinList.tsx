import { useSelectedCoins } from "../../store/useSelectedCoins";
import { COINS } from "../../data/coins";
import ChainCoin from "./ChainCoin";

export default function ChainCoinList({ metrics = {} }) {
  const { selectedIds, toggle } = useSelectedCoins();

  const coinList = Object.entries(COINS).map(([key, coin]) => ({
    id: key,
    name: coin.name,
    coin: coin.symbol,
    chain: coin.chain,
    coinImg: coin.image,
    stats: metrics[key] ?? { endo: 0, exter: 0, netflow: 0 },
  }));

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
        />
      ))}
    </div>
  );
}
