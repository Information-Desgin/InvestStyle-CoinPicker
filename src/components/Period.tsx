import dayjs from "dayjs";
import { useDateRange } from "../store/useDateRange";

export default function Period() {
  const { startDate, endDate } = useDateRange();

  return (
    <div className="flex flex-col items-center w-[190px] gap-[40px] pt-4">
      <div className="self-start font-subtitle">Period</div>

      <div className="flex justify-between w-full">
        {/* Start date */}
        <div className="flex flex-col items-center gap-2">
          <div className="font-body2-light text-sub-text">Start date</div>
          <input
            className="border border-point w-[80px] h-[25px] rounded-[3px] px-1 font-body2-light text-center"
            value={startDate ? dayjs(startDate).format("YYYY-MM-DD") : ""}
            readOnly
          />
        </div>

        <div className="pt-[26px] font-body1-light">-</div>

        {/* End date */}
        <div className="flex flex-col items-center gap-2">
          <div className="font-body2-light text-sub-text">End date</div>
          <input
            className="border border-point w-[80px] h-[25px] rounded-[3px] px-1 font-body2-light text-center"
            value={endDate ? dayjs(endDate).format("YYYY-MM-DD") : ""}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}
