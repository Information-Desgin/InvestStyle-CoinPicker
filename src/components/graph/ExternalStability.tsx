"use client";

import { ResponsiveLine } from "@nivo/line";
import { useMemo } from "react";
import { timeFormat } from "d3-time-format";
import { useSelectedCoins } from "../../store/useSelectedCoins";
import { COINS } from "../../data/coins";
import { generateDummyExternalStability } from "../../data/mockExternalStability";

export default function ExternalStability() {
  const { selectedIds } = useSelectedCoins();

  const chartData = useMemo(() => {
    if (selectedIds.length === 0) return [];

    const dummy = generateDummyExternalStability(
      selectedIds.map((id) => ({
        id,
        color: COINS[id].color,
      }))
    );

    return dummy.map((coin) => ({
      id: coin.id,
      color: coin.color,
      data: coin.values.map((d) => ({
        x: new Date(d.timestamp),
        y: d.value,
        actual: d.value,
      })),
    }));
  }, [selectedIds]);

  if (chartData.length === 0) {
    return (
      <div className="flex h-[320px] items-center justify-center text-sm text-neutral-400">
        코인을 선택하면 외부 안정성 추세가 표시됩니다.
      </div>
    );
  }

  return (
    <div className="w-full h-[320px]">
      <ResponsiveLine
        data={chartData}
        margin={{ top: 20, right: 30, bottom: 40, left: 40 }}
        xScale={{ type: "time", format: "native", precision: "day" }}
        yScale={{ type: "linear", min: 0, max: 1 }}
        axisBottom={{
          format: "%Y.%m",
          tickValues: "every 2 months",
        }}
        axisLeft={{ tickValues: 5 }}
        curve="monotoneX"
        colors={{ datum: "color" }}
        lineWidth={2}
        pointSize={5}
        pointBorderWidth={2}
        pointBorderColor={{ from: "seriesColor" }}
        pointColor="#000"
        enableSlices="x"
        useMesh
        tooltip={({ point }) => (
          <div className="rounded-md border border-neutral-700 bg-black/90 px-3 py-2 text-xs text-white">
            <div className="mb-1 font-medium">
              {timeFormat("%Y.%m.%d")(point.data.x as Date)}
            </div>
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: point.seriesColor }}
              />
              <span>{point.seriesId}</span>
              <span className="ml-auto font-mono">
                {Number(point.data.actual).toFixed(2)}
              </span>
            </div>
          </div>
        )}
        theme={{
          background: "transparent",
          axis: {
            ticks: {
              text: { fill: "#9ca3af", fontSize: 11 },
              line: { stroke: "#374151" },
            },
          },
          grid: {
            line: {
              stroke: "#1f2937",
              strokeDasharray: "4 4",
            },
          },
        }}
      />
    </div>
  );
}
