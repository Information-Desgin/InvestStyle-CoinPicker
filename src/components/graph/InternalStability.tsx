"use client";

import { ResponsiveBar } from "@nivo/bar";
import { useMemo } from "react";
import { useSelectedCoins } from "../../store/useSelectedCoins";
import { generateDummyInternalStability } from "../../data/mockInternalStability";

const KEYS = ["onchain", "active", "staking", "price", "validator"] as const;

const KEY_LABEL: Record<(typeof KEYS)[number], string> = {
  onchain: "On-chain Transaction Stability",
  active: "Active Account Stability",
  staking: "Staking Stability",
  price: "Price Stability",
  validator: "Validator Stability",
};

const COLORS = {
  onchain: "#e5e7eb",
  active: "#c7d2fe",
  staking: "#93c5fd",
  price: "#2563eb",
  validator: "#0f172a",
};

export default function InternalStability() {
  const { selectedIds } = useSelectedCoins();

  const data = useMemo(() => {
    if (selectedIds.length === 0) return [];
    return generateDummyInternalStability(selectedIds);
  }, [selectedIds]);

  if (data.length === 0) {
    return (
      <div className="flex h-[360px] items-center justify-center text-sm text-neutral-400">
        코인을 선택하면 Internal Stability 구성이 표시됩니다
      </div>
    );
  }

  return (
    <div className="w-full h-[360px]">
      <ResponsiveBar
        data={data}
        keys={KEYS}
        indexBy="coin"
        margin={{ top: 20, right: 160, bottom: 40, left: 50 }}
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={({ id }) => COLORS[id as keyof typeof COLORS]}
        axisBottom={{
          tickSize: 0,
          tickPadding: 10,
        }}
        axisLeft={{
          tickValues: 5,
        }}
        enableLabel={false}
        enableGridY
        tooltip={({ id, value, indexValue }) => (
          <div className="rounded-md border border-neutral-700 bg-black/90 px-3 py-2 text-xs text-white">
            <div className="mb-1 font-medium">{indexValue}</div>
            <div className="flex justify-between gap-4">
              <span>{KEY_LABEL[id as keyof typeof KEY_LABEL]}</span>
              <span className="font-mono">{Number(value).toFixed(2)}</span>
            </div>
          </div>
        )}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            translateX: 150,
            itemWidth: 140,
            itemHeight: 18,
            symbolSize: 12,
            itemTextColor: "#d1d5db",
            data: KEYS.map((k) => ({
              id: k,
              label: KEY_LABEL[k],
            })),
          },
        ]}
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
          legends: {
            text: {
              fill: "#d1d5db",
              fontSize: 11,
            },
          },
        }}
      />
    </div>
  );
}
