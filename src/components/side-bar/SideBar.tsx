import { useState } from "react";
import ChainCoinList from "./ChainCoinList";
import type { InvestStyle } from "../../types/chainCoinList";
import InvestStyleSelector from "./InvestStyleFilter";
import MetricLabel from "./MetricLabel";

export default function SideBar() {
  const [style, setStyle] = useState<InvestStyle>("stable");

  return (
    <aside className="min-w-[230px] section-border-r overflow-y-auto h-full flex flex-col pt-[30px] scrollbar-custom">
      <div className="px-[27px]">
        <div className="font-subtitle mb-[25px]">Filter</div>

        {/* 투자 성향 필터 */}
        <InvestStyleSelector value={style} onChange={setStyle} />
      </div>

      <div className="flex gap-[15px] mt-[37px] justify-center">
        {/* 선택된 투자 성향 표시 영역 */}
        <div className="mt-[10px]">
          <div className="font-element-bold text-point border-b border-point pb-[4px] capitalize">
            {style}
          </div>
          <div className="font-element-light mt-[8px]">Chain–Coin List</div>
        </div>

        {/* 지표 라벨  */}
        <div className="flex flex-col gap-[6px]">
          <div className="flex flex-col gap-[6px] mt-[10px]">
            <MetricLabel color="internal" text="Internal Stability" />
            <MetricLabel color="external" text="External Stability" />
            <MetricLabel color="netflow" text="NetFlow" />
          </div>
        </div>
      </div>

      {/* 체인 - 코인 리스트 */}
      <div className="mt-[30px]">
        <ChainCoinList sort={style} />
      </div>
    </aside>
  );
}
