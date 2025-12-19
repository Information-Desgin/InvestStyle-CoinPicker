export default function Period() {
  return (
    <div className="flex flex-col items-center w-[190px] gap-[40px] pt-4">
      <div className="self-start font-subtitle">Period</div>
      <div className="flex justify-between w-full">
        <div className="flex flex-col items-center gap-2">
          <div className="font-body2-light text-sub-text">Start date</div>
          <input className="border border-point w-[80px] h-[25px] rounded-[3px]" />
        </div>
        <div className="pt-[26px] font-body1-light">-</div>
        <div className="flex flex-col items-center gap-2">
          <div className="font-body2-light text-sub-text">End date</div>
          <input className="border border-point w-[80px] h-[25px] rounded-[3px]" />
        </div>
      </div>
    </div>
  );
}
