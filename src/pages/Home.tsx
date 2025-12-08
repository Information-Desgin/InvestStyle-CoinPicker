import SideBar from "../components/side-bar/SideBar";
import Header from "../components/header/Header";

export default function Home() {
  return (
    <div className="flex h-dvh">
      <SideBar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="overflow-y-auto">
          <div className="grid grid-cols-[560px_710px] h-[560px] section-border-b">
            <div className="section-border-r">Fund Flow</div>
            <div>Investment Type Classification</div>
          </div>
          <div className="section-border-b h-[440px]">External Stability</div>
          <div className="grid grid-cols-[670px_600px] h-[400px]">
            <div className="section-border-r">Internal Stability</div>
            <div>Fund Inflow and Outflow</div>
          </div>
        </main>
      </div>
    </div>
  );
}
