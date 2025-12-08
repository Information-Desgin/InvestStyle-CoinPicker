import { useState } from "react";
import ChainCoinList from "../ChainCoinList";
import InvestStyleFilter from "./InvestStyleFilter";
import type { InvestStyle } from "../../types/chainCoinList";

export default function SideBar(){

    const [sortType, setSortType] = useState<InvestStyle>("all");

    return(
        <aside className="w-[230px] border-r border-white overflow-y-auto h-full">
            {/* 투자 성향 필터 */}
            <InvestStyleFilter />
            
            {/* 체인 - 코인 리스트 */}
            <ChainCoinList sort={sortType}/>

        </aside>
    );
};

