import { ResponsiveBar } from "@nivo/bar";
import { useMemo } from "react";
import * as d3 from "d3";
import { useSelectedCoins } from "../../store/useSelectedCoins";
import { COINS } from "../../data/coins";
import { generateDummyInternalStability } from "../../data/mockInternalStability";

/* 내부 안정성 지표 */
const KEYS = ["onchain", "active", "staking", "price", "validator"] as const;
const STACK_KEYS = [...KEYS].reverse();

/* 지표 라벨 */
const KEY_LABEL: Record<(typeof KEYS)[number], string> = {
  onchain: "On-chain Transaction Stability",
  active: "Active Account Stability",
  staking: "Staking Stability",
  price: "Price Stability",
  validator: "Validator Stability",
};

/* 지표별 명도 */
const METRIC_LIGHTNESS: Record<(typeof KEYS)[number], number> = {
  onchain: 85,
  active: 75,
  staking: 65,
  price: 50,
  validator: 35,
};

function applyLightness(hex: string, lightness: number) {
  const hsl = d3.hsl(hex);
  hsl.l = lightness / 100;
  return hsl.toString();
}

export default function InternalStability() {
  const { selectedIds } = useSelectedCoins();

  const data = useMemo(() => {
    if (selectedIds.length === 0) return [];
    return generateDummyInternalStability(selectedIds);
  }, [selectedIds]);

  if (data.length === 0) {
    return (
      <div className="flex h-[360px] items-center justify-center text-sm text-neutral-400">
        코인을 선택하면 Internal Stability 구성이 표시됩니다.
      </div>
    );
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveBar
        data={data}
        keys={STACK_KEYS}
        indexBy="coin"
        margin={{ top: 20, right: 180, bottom: 40, left: 60 }}
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={({ id, indexValue }) => {
          const baseColor = COINS[indexValue as string]?.color ?? "#60a5fa";
          const lightness =
            METRIC_LIGHTNESS[id as keyof typeof METRIC_LIGHTNESS] ?? 50;

          return applyLightness(baseColor, lightness);
        }}
        axisBottom={{
          tickSize: 0,
          tickPadding: 10,
        }}
        axisLeft={{
          tickValues: 5,
        }}
        enableLabel={false}
        enableGridY
        tooltip={({ id: activeKey, indexValue }) => {
          const coin = indexValue as string;
          const coinColor = COINS[coin]?.color ?? "#60a5fa";

          const row = data.find((d) => d.coin === coin);
          if (!row) return null;

          return (
            <div
              style={{
                background: "rgba(0,0,0,0.9)",
                border: "2px solid #60a5fa",
                borderRadius: 14,
                padding: "18px 20px",
                minWidth: 260,
                color: "#fff",
              }}
            >
              {/* 코인명 */}
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  marginBottom: 16,
                }}
              >
                {coin}
              </div>

              {/* 지표 리스트 */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                {KEYS.map((key) => {
                  const isActive = key === activeKey;

                  const dotColor = applyLightness(
                    coinColor,
                    METRIC_LIGHTNESS[key]
                  );

                  return (
                    <div
                      key={key}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        fontSize: isActive ? 17 : 16,
                        fontWeight: isActive ? 600 : 400,
                        background: isActive
                          ? "rgba(96,165,250,0.12)"
                          : "transparent",
                        padding: "6px 8px",
                        borderRadius: 8,
                      }}
                    >
                      {/* 지표별 명도 점 */}
                      <span
                        style={{
                          width: isActive ? 14 : 12,
                          height: isActive ? 14 : 12,
                          borderRadius: "50%",
                          backgroundColor: dotColor,
                          flexShrink: 0,
                        }}
                      />

                      {/* 지표 이름 */}
                      <span style={{ flex: 1 }}>{KEY_LABEL[key]}</span>

                      {/* 값 */}
                      <span
                        style={{
                          fontFamily:
                            "ui-monospace, SFMono-Regular, Menlo, monospace",
                          fontSize: isActive ? 18 : 16,
                          color: isActive ? "#e0f2fe" : "#fff",
                        }}
                      >
                        {Number(row[key]).toFixed(1)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            translateX: 160,
            itemWidth: 160,
            itemHeight: 18,
            symbolSize: 12,
            symbolShape: "square",
            itemTextColor: "#d1d5db",
            data: KEYS.map((k) => ({
              id: k,
              label: KEY_LABEL[k],
              color: applyLightness("#000000", METRIC_LIGHTNESS[k]),
            })),

            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#ffffff",
                },
              },
            ],
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
