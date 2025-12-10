import { useState } from "react";
import ChainCoinList from "./ChainCoinList";
import type { InvestStyle } from "../../types/chainCoinList";
import InvestStyleSelector from "./InvestStyleFilter";

export default function SideBar() {
  const [style, setStyle] = useState<InvestStyle>("stable");

  return (
    <aside className="w-[230px] section-border-r overflow-y-auto h-full flex flex-col gap-[25px] pt-[30px] px-[27px]">
      {/* FILTER 타이틀 */}
      <div className="text-[20px] font-medium mb-[10px]">Filter</div>

      {/* 투자 성향 필터 */}
      <InvestStyleSelector value={style} onChange={setStyle} />

      <div className="flex gap-[25px]">
        {/* 선택된 투자 성향 표시 영역 */}
        <div className="mt-[10px]">
          <div className="text-[12px] font-medium text-point300 border-b border-point300 pb-[4px] capitalize">
            {style}
          </div>
          <div className="mt-[8px] text-[10px] text-white/70">
            Chain–Coin List
          </div>
        </div>

        {/* 지표 라벨  */}
        <div className="flex flex-col gap-[6px] mt-[10px]">
          <Label color="#7ce0c9" text="Internal Stability" />
          <Label color="#ffc85c" text="External Stability" />
          <Label color="#ff717e" text="NetFlow" />
        </div>
      </div>

      {/* 체인 - 코인 리스트 */}
      <div className="mt-[15px]">
        <ChainCoinList sort={style} />
      </div>
    </aside>
  );
}

/* ─────────────────────────────
   지표 라벨 컴포넌트
────────────────────────────── */
function Label({ color, text }: { color: string; text: string }) {
  return (
    <div className="flex items-center gap-[7px]">
      <div
        className="w-[10px] h-[10px] rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="text-[8px] text-white/80">{text}</span>
    </div>
  );
}
