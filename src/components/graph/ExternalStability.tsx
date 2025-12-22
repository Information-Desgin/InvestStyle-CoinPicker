import { ResponsiveLine, type LineSeries } from "@nivo/line";
import { useRef, useState } from "react";
import { timeFormat } from "d3-time-format";
import { TooltipContainer } from "../interaction/tooltip/ToolTipContainer";
import { TooltipRow } from "../interaction/tooltip/ToolTipRow";
import type { ExternalStabilitySeries } from "../../types/externalStability";

type ExternalStabilityProps = {
  data: ExternalStabilitySeries[];
};

export default function ExternalStability({ data }: ExternalStabilityProps) {
  // const { selectedIds } = useSelectedCoins();
  const chartRef = useRef<HTMLDivElement>(null);
  const [hoverX, setHoverX] = useState<number | null>(null);

  // const chartData = useMemo(() => {
  //   if (selectedIds.length === 0) return [];

  //   const dummy = generateDummyExternalStability(
  //     selectedIds.map((id) => ({
  //       id,
  //       color: COINS[id].color,
  //     }))
  //   );

  //   return dummy.map((coin) => ({
  //     id: coin.id,
  //     color: coin.color,
  //     data: coin.values.map((d) => ({
  //       x: new Date(d.timestamp),
  //       y: d.value,
  //       actual: d.value,
  //     })),
  //   }));
  // }, [selectedIds]);
  const chartData: LineSeries[] = data.map((series) => ({
    id: series.id,
    color: series.color,
    data: series.points.map((p) => ({
      x: new Date(p.date),
      y: p.value,
      actual: p.value,
    })),
  }));

  if (data.length === 0) {
    return (
      <div className="flex h-[320px] items-center justify-center text-sm text-neutral-400">
        Select a coin to view External Stability.
      </div>
    );
  }

  return (
    <div ref={chartRef} className="relative w-full h-[320px] pt-4">
      <ResponsiveLine
        data={chartData}
        margin={{ top: 20, right: 30, bottom: 40, left: 40 }}
        xScale={{ type: "time", format: "native", precision: "day" }}
        yScale={{ type: "linear", min: 0, max: 1 }}
        axisBottom={{
          format: "%Y.%m.%d",
          tickValues: "every day",
        }}
        axisLeft={{ tickValues: 5 }}
        curve="monotoneX"
        colors={{ datum: "color" }}
        lineWidth={2}
        enablePoints={false}
        pointBorderColor={{ from: "seriesColor" }}
        pointColor="#000"
        enableSlices="x"
        useMesh
        onMouseMove={(_, event) => {
          const bounds = chartRef.current?.getBoundingClientRect();
          if (!bounds) return;
          setHoverX(event.clientX - bounds.left);
        }}
        onMouseLeave={() => setHoverX(null)}
        sliceTooltip={({ slice }) => {
          const sortedPoints = [...slice.points].sort(
            (a, b) =>
              Number((b.data as any).actual) - Number((a.data as any).actual)
          );

          return (
            <TooltipContainer
              title={timeFormat("%Y.%m.%d")(slice.points[0].data.x as Date)}
            >
              {sortedPoints.map((point) => (
                <TooltipRow
                  key={point.id}
                  dotColor={point.seriesColor}
                  label={String(point.seriesId).toUpperCase()}
                  value={Number((point.data as any).actual).toFixed(1)}
                />
              ))}
            </TooltipContainer>
          );
        }}
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

      {/* 커스텀 그라데이션 크로스헤어 */}
      {hoverX !== null && (
        <div
          className="pointer-events-none absolute top-0 h-full"
          style={{
            left: hoverX,
            width: 2,
            transform: "translateX(-1px)",
            background: `
              linear-gradient(
                180deg,
                rgba(0,0,0,0) 0%,
                rgba(255,255,255,0.25) 25%,
                rgba(255,255,255,0.8) 50%,
                rgba(255,255,255,0.25) 75%,
                rgba(0,0,0,0) 100%
              )
            `,
          }}
        />
      )}
    </div>
  );
}
