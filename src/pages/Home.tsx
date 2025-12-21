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

export default function Home() {
  const [flow, setFlow] = useState<("Inflow" | "Outflow")[]>([
    "Outflow",
    "Inflow",
  ]);
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

  // 데이터 상태
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
  console.log("netflow (first 5)", normalizedNetFlow.slice(0, 5));
  console.log("netFlowBoxData", netFlowBoxData);

  return (
    <div className="flex h-dvh">
      <SideBar />
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
                <ChordDiagram flow={showFlowToggle ? flow : undefined} />
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
                <QuadrantBubbleChart />
              </AnalyticsSection>
            </div>
          </div>
          <div className="section-border-b h-[440px]">
            <AnalyticsSection
              title="External Stability"
              description="Illustrates how each token’s price responds to external capital flows over time."
            >
              <ExternalStability />
            </AnalyticsSection>
          </div>
          <div className="grid grid-cols-[670px_600px] h-[400px]">
            <div className="section-border-r">
              <AnalyticsSection
                title="Internal Stability"
                description="Summarizes each token’s stability based on internal on-chain dynamics."
              >
                <InternalStability />
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
