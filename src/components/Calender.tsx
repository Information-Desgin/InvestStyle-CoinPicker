import ReactCalendar from "react-calendar";

import dayjs from "dayjs";
import "react-calendar/dist/Calendar.css";
import { useDateRange } from "../store/useDateRange";
import type { Value } from "react-calendar/dist/shared/types.js";

export default function Calendar() {
  const { startDate, endDate, setDateRange } = useDateRange();

  const handleDateChange = (value: Value) => {
    if (!Array.isArray(value)) return;

    const [start, end] = value;

    setDateRange(start ?? null, end ?? null);
  };

  const calendarValue: Value =
    startDate && endDate ? [startDate, endDate] : null;

  return (
    <ReactCalendar
      selectRange
      onChange={handleDateChange}
      value={calendarValue}
      formatDay={(_, date) => dayjs(date).format("DD")}
      formatShortWeekday={(_, date) => dayjs(date).format("dd").toUpperCase()}
      formatMonthYear={(_, date) => dayjs(date).format("MMMM YYYY")}
      tileClassName={({ date }) => {
        if (!startDate || !endDate) return "";

        if (dayjs(date).isSame(startDate, "day")) return "range-start";
        if (dayjs(date).isSame(endDate, "day")) return "range-end";
        if (
          dayjs(date).isAfter(startDate, "day") &&
          dayjs(date).isBefore(endDate, "day")
        ) {
          return "range-middle";
        }

        return "";
      }}
    />
  );
}
