import { ResponsiveBar } from "@nivo/bar";
import { useMemo } from "react";
import * as d3 from "d3";
import { useSelectedCoins } from "../../store/useSelectedCoins";
import { COINS } from "../../data/coins";
import { generateDummyInternalStability } from "../../data/mockInternalStability";
import { TooltipContainer } from "../interaction/tooltip/ToolTipContainer";
import { TooltipRow } from "../interaction/tooltip/ToolTipRow";

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
    <div className="w-full h-[300px] pt-4">
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
            <TooltipContainer title={coin.toUpperCase()}>
              <div
                style={{ display: "flex", flexDirection: "column" }}
                className="gap-[10px]"
              >
                {KEYS.map((key) => {
                  const isActive = key === activeKey;

                  return (
                    <TooltipRow
                      key={key}
                      dotColor={applyLightness(
                        coinColor,
                        METRIC_LIGHTNESS[key]
                      )}
                      label={KEY_LABEL[key]}
                      value={Number(row[key]).toFixed(1)}
                      isActive={isActive}
                    />
                  );
                })}
              </div>
            </TooltipContainer>
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
              fontSize: "var(--text-xs)",
              fontFamily: "var(--font-sub)",
              fontWeight: "var(--font-weight-light)",
            },
          },
        }}
      />
    </div>
  );
}
