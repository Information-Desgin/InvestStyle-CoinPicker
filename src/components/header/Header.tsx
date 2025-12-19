import Calendar from "../Calender";
import Period from "../Period";

export default function Header() {
  return (
    <header className="grid-rows-[180px] grid grid-cols-[810px_470px] section-border-b w-full">
      {/* 제목 */}
      <div className="section-border-r flex items-center">
        <div className="w-[10px] h-[66px] mx-[30px] bg-point" />
        <div className="font-title">InvestStyle CoinPicker</div>
      </div>
      {/* 기간 */}
      <div className="flex items-start justify-center gap-[30px]">
        <Period />
        <Calendar />
      </div>
    </header>
  );
}
