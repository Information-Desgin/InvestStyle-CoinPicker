import SideBar from "../components/side-bar/SideBar";
import Header from "../components/header/Header";
import ChordDiagram from "../components/graph/ChordDiagram";
import QuadrantBubbleChart from "../components/graph/BubbleChart";
import ExternalStability from "../components/graph/ExternalStability";

export default function Home() {
  return (
    <div className="flex h-dvh">
      <SideBar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="overflow-y-auto">
          <div className="grid grid-cols-[560px_710px] h-[560px] section-border-b">
            <div className="section-border-r flex justify-center items-center">
              <ChordDiagram />
            </div>
            <div>
              <QuadrantBubbleChart />
            </div>
          </div>
          <div className="section-border-b h-[440px]">
            <ExternalStability />
          </div>
          <div className="grid grid-cols-[670px_600px] h-[400px]">
            <div className="section-border-r">Internal Stability</div>
            <div>Fund Inflow and Outflow</div>
          </div>
        </main>
      </div>
    </div>
  );
}
