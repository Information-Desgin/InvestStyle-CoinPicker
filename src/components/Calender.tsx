"use client";

import ReactCalendar from "react-calendar";
import dayjs from "dayjs";
import "react-calendar/dist/Calendar.css";

export default function Calendar({ onChange, value }) {
  const handleDateChange = (date) => {
    onChange(date);
  };

  return (
    <ReactCalendar
      onChange={handleDateChange}
      value={value}
      selectRange={true}
      formatDay={(locale, date) => dayjs(date).format("DD")}
      formatShortWeekday={(locale, date) =>
        dayjs(date).format("dd").toUpperCase()
      }
      formatMonthYear={(locale, date) => dayjs(date).format("MMMM YYYY")}
      tileClassName={({ date }) => {
        if (!Array.isArray(value)) return "";
        const [start, end] = value;
        if (!start || !end) return "";

        if (dayjs(date).isSame(start, "day")) return "range-start";
        if (dayjs(date).isSame(end, "day")) return "range-end";
        if (
          dayjs(date).isAfter(start, "day") &&
          dayjs(date).isBefore(end, "day")
        )
          return "range-middle";

        return "";
      }}
    />
  );
}
