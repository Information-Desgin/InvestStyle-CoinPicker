import SideBar from "../components/side-bar/SideBar";
import Header from "../components/header/Header";
import ChordDiagram from "../components/graph/ChordDiagram";
import QuadrantBubbleChart from "../components/graph/BubbleChart";
import ExternalStability from "../components/graph/ExternalStability";
import InternalStability from "../components/graph/InternalStability";
import NetFlow from "../components/graph/Netflow";
import { AnalyticsSection } from "../components/AnalyticsSection";
import ToggleBtn from "../components/interaction/ToggleBtn";
import { useEffect, useMemo, useState } from "react";
import { useSelectedCoins } from "../store/useSelectedCoins";
import { loadBaseInfo } from "../lib/loadBaseInfo";
import { loadRelayerFlow } from "../lib/loadRelayerFlow";
import { useDateRange } from "../store/useDateRange";
import type { BaseInfoRow, RelayerFlowRow } from "../types/csvData";
import { filterWithFallback } from "../utils/dateFilter";
import {
  BASE_INFO_DEFAULT_RANGE,
  RELAYER_FLOW_DEFAULT_RANGE,
} from "../constants/dateRange";
import { toLocalDateString } from "../utils/toLocalDateString";
import {
  aggregateDailyFlows,
  buildNetFlowPoints,
  normalizeDailyNetFlow,
} from "../utils/netflow";
import { calcInternalStability } from "../utils/internal/calcInternalStability";
import { CHAIN_TO_COIN_ID } from "../utils/coinMap";
import { adaptBaseInfoForInternalStability } from "../utils/internal/internalStabilityAdapter";
import { buildExternalStabilitySeries } from "../utils/externalStability";
import { COINS } from "../data/coins";
import { buildRealFlows } from "../utils/buildRealFlow";

const windowMap = {
  "4 days": 4,
  "7 days": 7,
  "9 days": 9,
};

interface AnalyticsSummary {
  coinId: string;
  internalAvg: number;
  externalAvg: number;
  netflowAvg: number;
  marketCapAvg: number;
}

export default function Home() {
  // 선택된 기간 (Date | null)
  const { startDate, endDate } = useDateRange();

  // Date → string 변환
  const startDateStr = startDate ? toLocalDateString(startDate) : null;
  const endDateStr = endDate ? toLocalDateString(endDate) : null;

  // DateRange (null 제거)
  const selectedBaseInfoRange =
    startDateStr && endDateStr
      ? { start: startDateStr, end: endDateStr }
      : BASE_INFO_DEFAULT_RANGE;

  const selectedFlowRange =
    startDateStr && endDateStr
      ? { start: startDateStr, end: endDateStr }
      : RELAYER_FLOW_DEFAULT_RANGE;

  // 선택된 코인
  const { selectedIds } = useSelectedCoins();
  const showFlowToggle = selectedIds.length === 1;

  // Chord Diagram - 선택된 흐름 (Inflow / Outflow)
  const [flow, setFlow] = useState<("Inflow" | "Outflow")[]>([
    "Outflow",
    "Inflow",
  ]);
  // External Stability - 선택된 일수 (rolling window)
  const [windowSize, setWindowSize] = useState<"4 days" | "7 days" | "9 days">(
    "4 days"
  );

  // 데이터 state
  const [baseInfo, setBaseInfo] = useState<BaseInfoRow[]>([]);
  const [flows, setFlows] = useState<RelayerFlowRow[]>([]);

  // 필터링된 base info 데이터
  const filteredBaseInfo = useMemo(
    () =>
      filterWithFallback(
        baseInfo,
        selectedBaseInfoRange,
        BASE_INFO_DEFAULT_RANGE
      ),
    [baseInfo, selectedBaseInfoRange]
  );

  // 필터링된 relayer flow 데이터
  const filteredFlows = useMemo(
    () =>
      filterWithFallback(flows, selectedFlowRange, RELAYER_FLOW_DEFAULT_RANGE),
    [flows, selectedFlowRange]
  );

  useEffect(() => {
    async function fetchData() {
      const baseInfoData = await loadBaseInfo();
      const flowsData = await loadRelayerFlow();

      setBaseInfo(baseInfoData);
      setFlows(flowsData);

      // console.log("baseInfo (first 5)", baseInfoData.slice(0, 5));
      // console.log("flows (first 5)", flowsData.slice(0, 5));
    }
    fetchData();
  }, []);

  useEffect(() => {
    console.log("filteredBaseInfo (first 5)", filteredBaseInfo.slice(0, 5));
    console.log("filteredFlows (first 5)", filteredFlows.slice(0, 5));
  }, [filteredBaseInfo, filteredFlows]);

  /*
  NetFlowBox 데이터 생성
  1. 일별 집계
  2. 정규화
  3. NetFlowBox 데이터 생성
  4. NetFlow 컴포넌트에 전달
  */
  const dailyAgg = useMemo(
    () => aggregateDailyFlows(filteredFlows),
    [filteredFlows]
  );
  const normalizedNetFlow = useMemo(
    () => normalizeDailyNetFlow(dailyAgg),
    [dailyAgg]
  );
  const netFlowBoxData = useMemo(
    () => buildNetFlowPoints(normalizedNetFlow),
    [normalizedNetFlow]
  );
  // console.log("netflow (first 5)", normalizedNetFlow.slice(0, 5));
  // console.log("netFlowBoxData", netFlowBoxData);

  /* Internal Stability 데이터 생성
  1. baseInfo 데이터를 코인별로 그룹화
  2. 선택된 코인에 해당하는 데이터만 필터링
  3. calcInternalStability 함수로 Internal Stability 계산
  4. InternalStability 컴포넌트에 전달
  */
  const internalStabilityData = useMemo(() => {
    const grouped = new Map<string, BaseInfoRow[]>();

    filteredBaseInfo.forEach((row) => {
      const coinId = CHAIN_TO_COIN_ID[row.chain.toLowerCase()];
      if (!coinId) return;

      if (!grouped.has(coinId)) grouped.set(coinId, []);
      grouped.get(coinId)!.push(row);
    });

    return Array.from(grouped.entries())
      .filter(([coinId]) => selectedIds.includes(coinId))
      .map(([coinId, rows]) => {
        const adapted = adaptBaseInfoForInternalStability(rows);
        const scores = calcInternalStability(adapted);

        return {
          coin: coinId,
          ...scores,
        };
      });
  }, [filteredBaseInfo, selectedIds]);

  const allInternalStabilityData = useMemo(() => {
    const grouped = new Map<string, BaseInfoRow[]>();

    filteredBaseInfo.forEach((row) => {
      const coinId = CHAIN_TO_COIN_ID[row.chain.toLowerCase()];
      if (!coinId) return;

      if (!grouped.has(coinId)) grouped.set(coinId, []);
      grouped.get(coinId)!.push(row);
    });

    return Array.from(grouped.entries()).map(([coinId, rows]) => {
      const adapted = adaptBaseInfoForInternalStability(rows);
      const scores = calcInternalStability(adapted);

      return {
        coin: coinId,
        ...scores,
      };
    });
  }, [filteredBaseInfo]);

  /* External Stability 데이터 생성
    1. filteredBaseInfo
    2. dailyAgg (이미 계산됨)
    3. rolling window 적용
    */
  const externalStabilitySeries = useMemo(() => {
    const window = windowMap[windowSize] as 2 | 4 | 7;

    return buildExternalStabilitySeries(
      filteredBaseInfo,
      dailyAgg,
      window
    ).filter((s) => selectedIds.includes(s.id));
  }, [filteredBaseInfo, dailyAgg, windowSize, selectedIds]);

  const allExternalStabilitySeries = useMemo(() => {
    const window = windowMap[windowSize] as 2 | 4 | 7;

    return buildExternalStabilitySeries(filteredBaseInfo, dailyAgg, window);
  }, [filteredBaseInfo, dailyAgg, windowSize]);

  const analyticsSummaries = useMemo(() => {
    const summaries: Record<string, AnalyticsSummary> = {};

    Object.keys(COINS).forEach((coinId) => {
      /* Internal */
      const internal = allInternalStabilityData.find((d) => d.coin === coinId);
      const internalAvg = internal
        ? (internal.price +
            internal.onchain +
            internal.staking +
            internal.active +
            internal.validator) /
          5
        : 0;

      /* External */
      const external = allExternalStabilitySeries.find((s) => s.id === coinId);
      const externalAvg =
        external && external.points.length
          ? external.points.reduce((a, b) => a + (b.value ?? 0), 0) /
            external.points.length
          : 0;

      /* Netflow */
      const netflow = netFlowBoxData.find((n) => n.group === coinId);
      const netflowAvg = netflow?.value ?? 0;

      /* MarketCap */
      const marketCaps = filteredBaseInfo
        .filter((r) => CHAIN_TO_COIN_ID[r.chain.toLowerCase()] === coinId)
        .map((r) => r.marketCap)
        .filter((v): v is number => typeof v === "number");

      const marketCapAvg =
        marketCaps.length > 0
          ? marketCaps.reduce((a, b) => a + b, 0) / marketCaps.length
          : 0;

      summaries[coinId] = {
        coinId,
        internalAvg,
        externalAvg,
        netflowAvg,
        marketCapAvg,
      };
    });

    return summaries;
  }, [
    allInternalStabilityData,
    allExternalStabilitySeries,
    netFlowBoxData,
    filteredBaseInfo,
  ]);

  const realFlows = useMemo(() => {
    return buildRealFlows(filteredFlows);
  }, [filteredFlows]);

  // useEffect(() => {
  //   console.log("analyticsSummaries", analyticsSummaries);
  // }, [analyticsSummaries, selectedIds]);

  return (
    <div className="flex h-dvh">
      <SideBar analyticsSummaries={analyticsSummaries} />

      <div className="flex flex-col flex-1">
        <Header />
        <main className="overflow-y-auto scrollbar-custom">
          <div className="grid grid-cols-[560px_710px] h-[590px] section-border-b">
            <div className="section-border-r flex justify-center items-center relative">
              <AnalyticsSection
                title="Capital Flow"
                subtitle="[Overview]"
                description="Illustrates how capital flows between chains and tokens across the ecosystem."
              >
                <ChordDiagram
                  flow={showFlowToggle ? flow : undefined}
                  flows={realFlows}
                />
              </AnalyticsSection>
              {showFlowToggle && (
                <ToggleBtn
                  options={["Inflow", "Outflow"] as const}
                  value={flow}
                  onChange={setFlow}
                  multiple
                />
              )}
            </div>
            <div>
              <AnalyticsSection
                title="Investment Type Classification"
                subtitle="[Comparison]"
                description="Positions tokens by their external stability and internal stability."
              >
                <QuadrantBubbleChart summaries={analyticsSummaries} />
              </AnalyticsSection>
            </div>
          </div>
          <div className="section-border-b h-[440px] relative">
            <AnalyticsSection
              title="External Stability"
              description="Illustrates how each token’s price responds to external capital flows over time."
            >
              <ExternalStability data={externalStabilitySeries} />
            </AnalyticsSection>
            <ToggleBtn
              options={["4 days", "7 days", "9 days"] as const}
              value={windowSize}
              onChange={setWindowSize}
            />
          </div>
          <div className="grid grid-cols-[670px_600px] h-[400px]">
            <div className="section-border-r">
              <AnalyticsSection
                title="Internal Stability"
                description="Summarizes each token’s stability based on internal on-chain dynamics."
              >
                <InternalStability data={internalStabilityData} />
              </AnalyticsSection>
            </div>
            <div>
              <AnalyticsSection
                title="Capital Inflow and Outflow"
                description="Highlights the distribution of net capital inflows and outflows over time."
              >
                <NetFlow data={netFlowBoxData} />
              </AnalyticsSection>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
