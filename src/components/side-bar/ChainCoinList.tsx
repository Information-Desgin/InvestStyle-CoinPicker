import { useState } from "react";
import type { InvestStyle } from "../../types/chainCoinList";
import ChainCoin from "./ChainCoin";
import { COINS } from "../../data/coins";

interface ChainCoinListProps {
  sort: InvestStyle;
  metrics: {
    [symbol: string]: {
      endo: number;
      exter: number;
      netflow: number;
    };
  };
}

export default function ChainCoinList({
  sort,
  metrics = {},
}: ChainCoinListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (symbol: string) => {
    setSelectedIds((prev) =>
      prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol]
    );
  };

  // COINS 객체를 배열로 변환
  const coinList = Object.entries(COINS).map(([key, coin]) => ({
    id: key,
    name: coin.name,
    coin: coin.symbol,
    color: coin.color,
    chain: coin.chain,
    coinImg: coin.image,
    stats: metrics[key] ?? { endo: 0, exter: 0, netflow: 0 },
  }));

  const sortedList = coinList;

  return (
    <div className="flex flex-col gap-[14px] w-full">
      {sortedList.map((item) => (
        <ChainCoin
          key={item.id}
          name={item.chain}
          coin={item.coin}
          color={item.color}
          coinImg={item.coinImg}
          isSelected={selectedIds.includes(item.id)}
          onClick={() => toggleSelect(item.id)}
          stats={item.stats}
        />
      ))}
    </div>
  );
}
