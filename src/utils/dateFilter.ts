export function filterByDateRange<T extends { date: string }>(
  data: T[],
  startDate: string,
  endDate: string
): T[] {
  return data.filter((row) => row.date >= startDate && row.date <= endDate);
}

type DateRange = {
  start: string;
  end: string;
};

export function filterWithFallback<T extends { date: string }>(
  data: T[],
  selectedRange: DateRange,
  fallbackRange: DateRange
): T[] {
  const filtered = filterByDateRange(
    data,
    selectedRange.start,
    selectedRange.end
  );

  if (filtered.length > 0) {
    return filtered;
  }

  // fallback
  return filterByDateRange(data, fallbackRange.start, fallbackRange.end);
}
