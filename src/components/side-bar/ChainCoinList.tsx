import { useState } from "react";
import type { InvestStyle } from "../../types/chainCoinList";
import ChainCoin from "./ChainCoin";

interface ChainCoinListProps {
  sort: InvestStyle;
}

const MOCK_DATA = [
  {
    id: 1,
    name: "COSMOS HUB",
    coin: "ATOM",
    color: "#6EC1FF",
    coinImg: "/images/atom.png",
    stats: { endo: 80, exter: 60, netflow: 40 },
  },
  {
    id: 2,
    name: "Osmosis",
    coin: "OSMO",
    color: "#8250FF",
    coinImg: "/images/osmo.png",
    stats: { endo: 75, exter: 50, netflow: 45 },
  },
  {
    id: 3,
    name: "Juno",
    coin: "JUNO",
    color: "#FF5C8A",
    coinImg: "/images/juno.png",
    stats: { endo: 60, exter: 55, netflow: 30 },
  },
  {
    id: 4,
    name: "Stargaze",
    coin: "STARS",
    color: "#9B51E0",
    coinImg: "/images/stars.png",
    stats: { endo: 50, exter: 40, netflow: 25 },
  },
];

export default function ChainCoinList({ sort }: ChainCoinListProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleSelect = (id: number) => {
    setSelectedIds(
      (prev) =>
        prev.includes(id)
          ? prev.filter((x) => x !== id) // 선택 해제
          : [...prev, id] // 추가 선택
    );
  };

  // sort값 따라 나중에 정렬 or 필터 적용 가능
  const sortedList = MOCK_DATA; // sort 반영은 이후에 추가 가능

  return (
    <div className="flex flex-col gap-[8px] mt-[15px] w-full">
      {sortedList.map((item) => (
        <ChainCoin
          key={item.id}
          name={item.name}
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
