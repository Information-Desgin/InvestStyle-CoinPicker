import { ResponsiveBoxPlot } from "@nivo/boxplot";
import { useMemo } from "react";
import { useSelectedCoins } from "../../store/useSelectedCoins";
import { COINS } from "../../data/coins";
import {
  generateDummyCapitalFlowBox,
  type CapitalFlowBox,
} from "../../data/mockCapitalFlowBox";

export default function NetFlow() {
  const { selectedIds } = useSelectedCoins();

  const data: CapitalFlowBox[] = useMemo(() => {
    if (selectedIds.length === 0) return [];
    return generateDummyCapitalFlowBox(selectedIds);
  }, [selectedIds]);

  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-neutral-400">
        코인을 선택하면 자금 유입/유출 분포가 표시됩니다.
      </div>
    );
  }

  return (
    <div className="w-full h-[300px] pt-4">
      <ResponsiveBoxPlot
        // layout="horizontal"
        data={data}
        margin={{ top: 20, right: 40, bottom: 40, left: 50 }}
        minValue={-1}
        maxValue={1}
        padding={0.5}
        colors={({ group }) => {
          const baseColor = COINS[group]?.color ?? "#60a5fa";
          return `${baseColor}66`; // HEX 코드 뒤에 투명도 추가
        }}
        boxOpacity={0.8}
        borderWidth={3}
        medianWidth={3}
        whiskerWidth={3}
        borderColor={({ group }) => COINS[group]?.color ?? "#60a5fa"}
        medianColor={({ group }) => COINS[group]?.color ?? "#60a5fa"}
        whiskerColor={({ group }) => COINS[group]?.color ?? "#60a5fa"}
        enableOutliers={false}
        enableWhiskerDots={true}
        whiskerEndSize={0.2}
        axisBottom={{
          legend: "Coin",
          legendOffset: 32,
        }}
        axisLeft={{
          tickValues: 5,
          legend: "Netflow",
          legendOffset: -40,
        }}
        tooltip={(tooltipProps) => {
          const { group, color, data } = tooltipProps;
          // console.log("tooltipProps", tooltipProps);

          if (!data?.values) return null;

          const [min, q1, median, q3, max] = data.values;

          return (
            <div
              style={{
                background: "rgba(0,0,0,0.9)",
                border: `2px solid ${color}`,
                borderRadius: 12,
                padding: "12px 14px",
                minWidth: 180,
                color: "#fff",
                fontSize: 12,
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 8, color }}>
                {group.toUpperCase()}
              </div>

              <div style={{ fontFamily: "ui-monospace", lineHeight: 1.6 }}>
                <div className="flex justify-between">
                  <span>Max</span>
                  <span>{max.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Q3</span>
                  <span>{q3.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-yellow-400">
                  <span>Median</span>
                  <span>{median.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Q1</span>
                  <span>{q1.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Min</span>
                  <span>{min.toFixed(2)}</span>
                </div>
              </div>
            </div>
          );
        }}
        theme={{
          background: "transparent",
          axis: {
            legend: {
              text: {
                fill: "#ffffff",
              },
            },
            ticks: {
              text: { fill: "#9ca3af", fontSize: 11 },
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
