import ReactCalendar from "react-calendar";
import dayjs from "dayjs";
import "react-calendar/dist/Calendar.css";
import { useDateRange } from "../store/useDateRange";

export default function Calendar() {
  const { startDate, endDate, setDateRange } = useDateRange();

  const handleDateChange = (date: Date | [Date, Date]) => {
    if (Array.isArray(date)) {
      const [start, end] = date;
      setDateRange(start ?? null, end ?? null);
    }
  };

  const value = startDate && endDate ? [startDate, endDate] : null;

  return (
    <ReactCalendar
      onChange={handleDateChange}
      value={value}
      selectRange
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
