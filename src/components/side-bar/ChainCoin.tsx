import clsx from "clsx";
import { useState } from "react";
import { TooltipRow } from "../interaction/tooltip/ToolTipRow";
import { TooltipContainer } from "../interaction/tooltip/ToolTipContainer";
import { TooltipPortal } from "../interaction/tooltip/TooltipPortal";

type ChainCoinProps = {
  name: string;
  coin: string;
  color: string;
  coinImg: string;
  isSelected: boolean;
  onClick?: () => void;
  stats?: {
    endo: number; // 0~100
    exter: number; // 0~100
    netflow: number; // 0~100
  };
  summary?: {
    marketCap: number;
    internal: number; // 0~1
    external: number; // 0~1
    netflow: number; // -1~1
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
  summary,
}: ChainCoinProps) {
  const [hover, setHover] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
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
            className="absolute h-full w-[5px] left-0 top-0"
            style={{ backgroundColor: color }}
          />
        )}

        {/* 코인 이미지 */}
        <div className="w-[26px] h-[26px] rounded-full overflow-hidden flex-shrink-0">
          <img
            src={coinImg}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 텍스트 */}
        <div className="flex flex-col overflow-hidden">
          <span className="font-chainname-bold truncate">{name}</span>
          <span className="font-body1-light mt-[1px] self-start text-sub-text">
            {coin}
          </span>
        </div>
      </div>

      {/* RIGHT : 선택된 경우 Bar */}
      {isSelected && stats && (
        <div className="flex flex-col gap-[5px] w-[60px] ml-[6px]">
          <Bar color="#69DDD1" width={stats.endo} />
          <Bar color="#FFEE00" width={stats.exter} />
          <Bar color="#FF00B2" width={stats.netflow} />
        </div>
      )}

      {/* TOOLTIP */}
      {hover && summary && (
        <TooltipPortal>
          <div
            className="fixed z-[9999] pointer-events-none"
            style={{
              left: mousePos.x + 16,
              top: mousePos.y + 16,
            }}
          >
            <TooltipContainer title={name}>
              <TooltipRow
                dotColor="#4A62A0"
                label="Market Cap"
                value={`$ ${Math.round(summary.marketCap).toLocaleString()}`}
              />
              <TooltipRow
                dotColor="#69DDD1"
                label="Internal Stability"
                value={summary.internal.toFixed(2)}
              />
              <TooltipRow
                dotColor="#FFEE00"
                label="External Stability"
                value={summary.external.toFixed(2)}
              />
              <TooltipRow
                dotColor="#FF00B2"
                label="Netflow"
                value={summary.netflow.toFixed(2)}
              />
            </TooltipContainer>
          </div>
        </TooltipPortal>
      )}
    </button>
  );
}

/* ---------- Sub Components ---------- */

function Bar({ color, width }: { color: string; width: number }) {
  return (
    <div
      className="h-[4px] rounded-full transition-all"
      style={{ backgroundColor: color, width: `${Math.min(width, 100)}%` }}
    />
  );
}
