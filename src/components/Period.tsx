export default function Period() {
  return (
    <div className="flex flex-col items-center w-[190px] gap-[17px] pt-4">
      <div className="self-start">Period</div>
      <div className="flex justify-between w-full">
        <div>
          <div>Start date</div>
          <input className="border border-point w-[80px] h-[25px] rounded-[3px]" />
        </div>
        <div className="pt-6">-</div>
        <div>
          <div>End date</div>
          <input className="border border-point w-[80px] h-[25px] rounded-[3px]" />
        </div>
      </div>
      <button className="flex-1 bg-point color-white h-[18px] self-stretch rounded-[3px]">
        Apply
      </button>
    </div>
  );
}
