import { ResponsiveLine } from "@nivo/line";
import { useMemo, useRef, useState } from "react";
import { timeFormat } from "d3-time-format";
import { useSelectedCoins } from "../../store/useSelectedCoins";
import { COINS } from "../../data/coins";
import { generateDummyExternalStability } from "../../data/mockExternalStability";

export default function ExternalStability() {
  const { selectedIds } = useSelectedCoins();
  const chartRef = useRef<HTMLDivElement>(null);
  const [hoverX, setHoverX] = useState<number | null>(null);

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
    <div ref={chartRef} className="relative w-full h-[320px] pt-4">
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
            (a, b) => Number(b.data.actual) - Number(a.data.actual)
          );

          return (
            <div
              style={{
                background: "rgba(0,0,0,0.85)",
                border: "2px solid #38bdf8",
                borderRadius: 14,
                padding: "16px 18px",
                minWidth: 220,
                color: "#fff",
              }}
            >
              {/* 날짜 */}
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  marginBottom: 14,
                }}
              >
                {timeFormat("%Y.%m.%d")(slice.points[0].data.x as Date)}
              </div>

              {/* 코인 리스트 (값 기준 내림차순) */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {sortedPoints.map((point) => (
                  <div
                    key={point.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      fontSize: 15,
                    }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: point.seriesColor,
                      }}
                    />
                    <span style={{ fontWeight: 500 }}>
                      {String(point.seriesId).toUpperCase()}
                    </span>
                    <span
                      style={{
                        marginLeft: "auto",
                        fontFamily:
                          "ui-monospace, SFMono-Regular, Menlo, monospace",
                      }}
                    >
                      {Number(point.data.actual).toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
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
