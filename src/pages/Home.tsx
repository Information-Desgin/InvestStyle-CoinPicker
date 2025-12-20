import SideBar from "../components/side-bar/SideBar";
import Header from "../components/header/Header";
import ChordDiagram from "../components/graph/ChordDiagram";
import QuadrantBubbleChart from "../components/graph/BubbleChart";
import ExternalStability from "../components/graph/ExternalStability";
import InternalStability from "../components/graph/InternalStability";
import NetFlow from "../components/graph/Netflow";
import { AnalyticsSection } from "../components/AnalyticsSection";
import ToggleBtn from "../components/interaction/ToggleBtn";
import { useState } from "react";
import { useSelectedCoins } from "../store/useSelectedCoins";

export default function Home() {
  const [flow, setFlow] = useState<("Inflow" | "Outflow")[]>(["Outflow"]);
  const { selectedIds } = useSelectedCoins();
  const showFlowToggle = selectedIds.length === 1;
  return (
    <div className="flex h-dvh">
      <SideBar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="overflow-y-auto scrollbar-custom">
          <div className="grid grid-cols-[560px_710px] h-[560px] section-border-b">
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
                <NetFlow />
              </AnalyticsSection>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
