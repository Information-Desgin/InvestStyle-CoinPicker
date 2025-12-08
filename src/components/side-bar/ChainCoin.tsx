import type { ChainCoin } from "../../types/chainCoinList";

interface ChainCoinProps {
    ChainCoin: ChainCoin
}

export default function ChainCoin({ChainCoin}: ChainCoinProps){
return(
    <>
    <div className="flex gap-9">
        {/* <Image src={ChainCoin.imgSrc} alt={ChainCoin.coin}/> */}
        <div className="flex flex-col gap-3">
            <div>{ChainCoin.chain}</div>
            <div>{ChainCoin.coin}</div>        
        </div>
        <div className="flex flex-col gap-6">
            {/* 외부안정성 Bar Chart */}
            <div></div>
            {/* 내부안정성 Bar Chart */}
            <div></div>
            {/* NetFlow Bar Chart */}
            <div></div>
        </div>
    </div>
    </>
);
}