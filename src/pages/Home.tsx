import SideBar from "../components/side-bar/SideBar";
import Header from "../components/header/Header";
import ChordDiagram from "../components/graph/ChordDiagram";
import QuadrantBubbleChart from "../components/graph/BubbleChart";
import ExternalStability from "../components/graph/ExternalStability";
import InternalStability from "../components/graph/InternalStability";
import NetFlow from "../components/graph/Netflow";
import { AnalyticsSection } from "../components/AnalyticsSection";

export default function Home() {
  return (
    <div className="flex h-dvh">
      <SideBar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="overflow-y-auto">
          <div className="grid grid-cols-[560px_710px] h-[560px] section-border-b">
            <div className="section-border-r flex justify-center items-center">
              <AnalyticsSection
                title="Capital Flow"
                subtitle="[Overview]"
                description="descripntiondescriptiondescriptiondescriptiondescriptiondescriptiondescription"
              >
                <ChordDiagram />
              </AnalyticsSection>
            </div>
            <div>
              <AnalyticsSection
                title="Investment Type Classification"
                subtitle="[Comparison]"
                description="descripntiondescriptiondescriptiondescriptiondescriptiondescriptiondescription"
              >
                <QuadrantBubbleChart />
              </AnalyticsSection>
            </div>
          </div>
          <div className="section-border-b h-[440px]">
            <AnalyticsSection
              title="External Stability"
              description="descripntiondescriptiondescriptiondescriptiondescriptiondescriptiondescription"
            >
              <ExternalStability />
            </AnalyticsSection>
          </div>
          <div className="grid grid-cols-[670px_600px] h-[400px]">
            <div className="section-border-r">
              <AnalyticsSection
                title="Internal Stability"
                description="descripntiondescriptiondescriptiondescriptiondescriptiondescriptiondescription"
              >
                <InternalStability />
              </AnalyticsSection>
            </div>
            <div>
              <AnalyticsSection
                title="Capital Inflow and Outflow"
                description="descripntiondescriptiondescriptiondescriptiondescriptiondescriptiondescription"
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
