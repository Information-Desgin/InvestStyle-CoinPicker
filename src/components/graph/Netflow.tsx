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
      <div className="flex h-[380px] items-center justify-center text-sm text-neutral-400">
        코인을 선택하면 자금 유입/유출 분포가 표시됩니다.
      </div>
    );
  }

  return (
    <div className="w-full h-[380px]">
      <ResponsiveBoxPlot
        data={data}
        margin={{ top: 20, right: 40, bottom: 40, left: 50 }}
        minValue={-1}
        maxValue={1}
        padding={0.5}
        colors={({ group }) => COINS[group]?.color ?? "#60a5fa"}
        borderRadius={2}
        borderWidth={2}
        borderColor={{ from: "color", modifiers: [["darker", 0.4]] }}
        axisBottom={{
          legend: "Coin",
          legendOffset: 32,
        }}
        axisLeft={{
          tickValues: 5,
          legend: "Netflow",
          legendOffset: -40,
        }}
        medianWidth={2}
        whiskerWidth={2}
        tooltip={({ data }) => (
          <div className="rounded-md border border-neutral-700 bg-black/90 px-3 py-2 text-xs text-white">
            <div className="mb-2 font-medium">{data.group}</div>

            <div className="space-y-1 font-mono">
              <div className="flex justify-between">
                <span>Min</span>
                <span>{data.min.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Q1</span>
                <span>{data.q1.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Median</span>
                <span>{data.median.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Q3</span>
                <span>{data.q3.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Max</span>
                <span>{data.max.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
        theme={{
          background: "transparent",
          axis: {
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
