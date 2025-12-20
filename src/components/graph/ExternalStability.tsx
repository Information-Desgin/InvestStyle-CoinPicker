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
        sliceTooltip={({ slice }) => (
          <div
            style={{
              background: "rgba(0,0,0,0.85)",
              border: "2px solid #38bdf8",
              borderRadius: 14,
              padding: "16px 18px",
              minWidth: 200,
              color: "#fff",
            }}
          >
            {/* 날짜 */}
            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 14,
                letterSpacing: "0.02em",
              }}
            >
              {timeFormat("%Y.%m.%d")(slice.points[0].data.x as Date)}
            </div>

            {/* 리스트 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {slice.points.map((point) => {
                const label = point.seriesId ?? point.id?.split(".")[0];

                return (
                  <div
                    key={point.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      fontSize: 15,
                    }}
                  >
                    {/* 코인 색상 점 */}
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: point.seriesColor,
                        flexShrink: 0,
                      }}
                    />

                    {/* 코인 이름 */}
                    <span style={{ fontWeight: 500 }}>
                      {label?.toUpperCase()}
                    </span>

                    {/* 값 */}
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
                );
              })}
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
