import Period from "../Period";

export default function Header() {
  return (
    <header className="grid-rows-[180px] grid grid-cols-[810px_470px] section-border-b w-full">
      {/* 제목 */}
      <div className="section-border-r flex items-center">
        <div className="w-[10px] h-[66px] mx-[30px] bg-point300" />
        <div>InvestStyle CoinPicker</div>
      </div>
      {/* 기간 */}
      <div className="flex items-center justify-center">
        <Period />
      </div>
    </header>
  );
}
