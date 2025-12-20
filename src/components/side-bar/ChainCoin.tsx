import clsx from "clsx";

type ChainCoinProps = {
  name: string;
  coin: string;
  color: string;
  coinImg: string;
  isSelected: boolean;
  onClick?: () => void;
  stats?: {
    endo: number;
    exter: number;
    netflow: number;
  };
};

export default function ChainCoin({
  name,
  coin,
  color,
  coinImg,
  isSelected,
  onClick,
  stats,
}: ChainCoinProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "w-full flex items-center justify-between transition-all cursor-pointer pl-[22px] py-[6px] relative",
        isSelected && "bg-box-clicked"
      )}
    >
      {/* LEFT */}
      <div className="flex items-center gap-[12px] flex-1 min-w-0">
        {/* 왼쪽 컬러바 */}
        {isSelected && (
          <div
            className="absolute h-full w-[5px] left-0 top-0 bg-point"
            style={{ backgroundColor: color }}
          />
        )}

        {/* 코인 이미지 */}
        <div
          className={clsx(
            "w-[26px] h-[26px] rounded-full overflow-hidden flex-shrink-0"
          )}
        >
          <img
            src={coinImg}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 텍스트 */}
        <div className="flex flex-col overflow-hidden">
          <span className="font-chainname-bold truncate">{name}</span>
          <span
            className={clsx(
              "font-body1-light mt-[1px] self-start text-sub-text"
            )}
          >
            {coin}
          </span>
        </div>
      </div>

      {/* RIGHT */}
      {isSelected && stats && (
        <div className="flex flex-col gap-[5px] w-[60px] ml-[6px]">
          <Bar color="#7ce0c9" width={stats.endo} />
          <Bar color="#ffc85c" width={stats.exter} />
          <Bar color="#ff717e" width={stats.netflow} />
        </div>
      )}
    </button>
  );
}

function Bar({ color, width }: { color: string; width: number }) {
  return (
    <div
      className="h-[6px] rounded-full"
      style={{ backgroundColor: color, width: `${width}%` }}
    />
  );
}
