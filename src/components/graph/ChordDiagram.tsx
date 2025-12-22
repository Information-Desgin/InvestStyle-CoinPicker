import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { COINS } from "../../data/coins";
import { useSelectedCoins } from "../../store/useSelectedCoins";

/* =======================
   Types
======================= */

type ChordDiagramProps = {
  flow?: ("Inflow" | "Outflow")[];
  flows: {
    keys: string[];
    matrix: number[][];
  };
};

/* =======================
   Component
======================= */

export default function ChordDiagramD3({ flows, flow }: ChordDiagramProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { selectedIds } = useSelectedCoins();

  useEffect(() => {
    if (!ref.current || flows.keys.length === 0) return;

    const { keys, matrix: originalMatrix } = flows;

    const container = d3.select(ref.current);
    container.selectAll("*").remove();

    /* =======================
       SVG Config
    ======================= */
    const width = 440;
    const height = 440;
    const outerRadius = Math.min(width, height) * 0.46;
    const innerRadius = outerRadius - 10;
    const ribbonRadius = innerRadius - 15;

    const svg = container
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    /* =======================
       Tooltip (사용자 스타일 유지)
    ======================= */
    const tooltip = d3
      .select("body")
      .append("div")
      .attr(
        "class",
        "pointer-events-none fixed z-50 border border-point bg-black/90 rounded-[5px] p-4 min-w-[150px]"
      )
      .style("opacity", 0);

    /* =======================
       Chord / Generators
       - 모양 고정: originalMatrix(전체 데이터)로 레이아웃 계산
    ======================= */
    const chord = d3
      .chordDirected()
      .padAngle(0.05)
      .sortGroups(null)
      .sortSubgroups(d3.descending)(originalMatrix);

    const arcGen = d3
      .arc<any>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);
    const ribbonGen = d3.ribbon().radius(ribbonRadius);

    /* =======================
       Opacity & Filter Rules
    ======================= */
    const isSingleInflow =
      flow?.includes("Inflow") && !flow?.includes("Outflow");
    const isSingleOutflow =
      flow?.includes("Outflow") && !flow?.includes("Inflow");

    // 리본 표시 여부 결정 함수
    const shouldShowRibbon = (sourceIdx: number, targetIdx: number) => {
      const sourceId = keys[sourceIdx];
      const targetId = keys[targetIdx];

      if (isSingleInflow) {
        return selectedIds.includes(targetId); // 타겟이 선택된 코인인 유입만 표시
      }
      if (isSingleOutflow) {
        return selectedIds.includes(sourceId); // 소스가 선택된 코인인 유출만 표시
      }
      return true; // 전체 모드
    };

    const arcOpacity = (id: string) =>
      selectedIds.length === 0 ? 1 : selectedIds.includes(id) ? 1 : 0.1;

    const ribbonOpacity = (source: string, target: string) => {
      if (selectedIds.length === 0) return 0.8;
      const isRelated =
        selectedIds.includes(source) || selectedIds.includes(target);
      return isRelated ? 0.9 : 0.05;
    };

    /* =======================
   ARCS 
======================= */
    svg
      .append("g")
      .selectAll("path")
      .data(chord.groups)
      .enter()
      .append("path")
      .attr("d", arcGen)
      .attr("fill", (d) => COINS[keys[d.index] as keyof typeof COINS].color)
      .attr("opacity", (d) => arcOpacity(keys[d.index]))
      .on("mouseover", (_, d) => {
        const id = keys[d.index];
        const color = COINS[id as keyof typeof COINS].color;

        // 유입 / 유출 계산
        const inflow = d3.sum(originalMatrix.map((row) => row[d.index]));
        const outflow = d3.sum(originalMatrix[d.index]);

        tooltip.style("opacity", 1).html(`
      <div class="font-chainname-bold mb-2" style="color: ${color}">
        ${COINS[id as keyof typeof COINS].chain.toUpperCase()}
      </div>
      <div class="font-body1-light">
        Inflow: ${inflow.toLocaleString()}
      </div>
      <div class="font-body1-light">
        Outflow: ${outflow.toLocaleString()}
      </div>
      <div class="font-body1-light mt-1 opacity-80">
        Total: ${(inflow + outflow).toLocaleString()}
      </div>
    `);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", `${event.pageX + 12}px`)
          .style("top", `${event.pageY + 12}px`);
      })
      .on("mouseout", () => tooltip.style("opacity", 0));

    /* =======================
       LABELS
    ======================= */
    const labelArc = d3
      .arc<any>()
      .innerRadius(outerRadius + 10)
      .outerRadius(outerRadius + 10);
    const labelGroup = svg.append("g");

    labelGroup
      .selectAll("path")
      .data(chord.groups)
      .enter()
      .append("path")
      .attr("id", (_, i) => `label-path-${i}`)
      .attr("d", labelArc)
      .attr("fill", "none");

    labelGroup
      .selectAll("text")
      .data(chord.groups)
      .enter()
      .append("text")
      .attr("fill", "#fff")
      .attr("font-size", "var(--text-sm)")
      .attr("font-family", "var(--font-sub)")
      .attr("opacity", (d) => arcOpacity(keys[d.index]))
      .append("textPath")
      .attr("href", (_, i) => `#label-path-${i}`)
      .attr("startOffset", "25%")
      .attr("text-anchor", "middle")
      .text((d) =>
        COINS[keys[d.index] as keyof typeof COINS].chain.toUpperCase()
      );

    /* =======================
       RIBBONS (필터링 적용)
    ======================= */
    /* =======================
   RIBBONS (필터링 적용)
======================= */
    svg
      .append("g")
      .selectAll("path")
      .data(
        chord.filter((d) => shouldShowRibbon(d.source.index, d.target.index))
      )
      .enter()
      .append("path")
      .attr("d", ribbonGen as any)
      .attr("fill", (d) => {
        const sourceId = keys[d.source.index];
        const targetId = keys[d.target.index];

        // 1. Inflow(유입) 모드: 나에게 돈을 보낸 '상대방(source)'의 색상 사용
        if (isSingleInflow) {
          return COINS[sourceId as keyof typeof COINS].color;
        }

        // 2. Outflow(유출) 모드: 내가 돈을 보낸 '상대방(target)'의 색상 사용
        if (isSingleOutflow) {
          return COINS[targetId as keyof typeof COINS].color;
        }

        // 3. 전체 모드: 기본적으로 출발지(source) 색상 사용
        return COINS[sourceId as keyof typeof COINS].color;
      })

      .attr("opacity", (d) =>
        ribbonOpacity(keys[d.source.index], keys[d.target.index])
      )
      .on("mouseover", (_, d) => {
        const s = keys[d.source.index];
        const t = keys[d.target.index];
        const val = d.source.value;

        tooltip.style("opacity", 1).html(`
          <div class="font-chainname-bold mb-2" style="color: ${
            COINS[s as keyof typeof COINS].color
          }">
            ${COINS[s as keyof typeof COINS].chain.toUpperCase()} → ${COINS[
          t as keyof typeof COINS
        ].chain.toUpperCase()}
          </div>
          <div class="font-body1-light">
            Amount: ${val.toLocaleString()}
          </div>
        `);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", `${event.pageX + 12}px`)
          .style("top", `${event.pageY + 12}px`);
      })
      .on("mouseout", () => tooltip.style("opacity", 0));

    return () => {
      tooltip.remove();
    };
  }, [flows, selectedIds, flow]);

  return <div ref={ref} />;
}
