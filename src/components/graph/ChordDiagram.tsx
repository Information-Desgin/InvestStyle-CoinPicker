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

    const { keys, matrix } = flows;

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
       Tooltip
    ======================= */

    const tooltip = d3
      .select("body")
      .append("div")
      .attr(
        "class",
        `
        pointer-events-none fixed z-50
        border border-point
        bg-black/90
        rounded-[5px]
        p-4
        min-w-[150px]
      `
      )
      .style("opacity", 0);

    /* =======================
       Chord / Generators
    ======================= */

    const chord = d3.chord().padAngle(0.05).sortSubgroups(d3.descending)(
      matrix
    );

    const arcGen = d3
      .arc<any>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    const ribbonGen = d3.ribbon<any>().radius(ribbonRadius);

    /* =======================
       Opacity Rules
    ======================= */

    const arcOpacity = (id: string) =>
      selectedIds.length === 0 ? 1 : selectedIds.includes(id) ? 1 : 0.1;

    const shouldShowRibbon = (source: string, target: string) => {
      if (selectedIds.length === 0) return true;

      if (selectedIds.length === 1) {
        const id = selectedIds[0];

        if (!flow || flow.length === 0 || flow.length === 2) {
          return source === id || target === id;
        }
        if (flow.includes("Inflow")) return target === id;
        if (flow.includes("Outflow")) return source === id;
      }

      return selectedIds.includes(source) && selectedIds.includes(target);
    };

    const ribbonOpacity = (s: string, t: string) =>
      shouldShowRibbon(s, t) ? 0.9 : 0.05;

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
      .attr("fill", (d) => COINS[keys[d.index]].color)
      .attr("opacity", (d) => arcOpacity(keys[d.index]))
      .on("mouseover", (_, d) => {
        const key = keys[d.index];
        tooltip.style("opacity", 1).html(`
          <div class="font-chainname-bold mb-2">
            ${COINS[key].chain}
          </div>
          <div class="font-body1-light">
            Total Flow: ${d.value.toLocaleString()}
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
      .text((d) => COINS[keys[d.index]].chain.toUpperCase());

    /* =======================
       RIBBONS
    ======================= */

    svg
      .append("g")
      .selectAll("path")
      .data(chord)
      .enter()
      .append("path")
      .attr("d", ribbonGen)
      .attr("fill", (d) => COINS[keys[d.target.index]].color)
      .attr("opacity", (d) =>
        ribbonOpacity(keys[d.source.index], keys[d.target.index])
      )
      .on("mouseover", (_, d) => {
        const s = keys[d.source.index];
        const t = keys[d.target.index];
        tooltip.style("opacity", 1).html(`
          <div class="font-chainname-bold mb-2">
            ${COINS[s].chain} → ${COINS[t].chain}
          </div>
          <div class="font-body1-light">
            Volume: ${d.source.value.toLocaleString()}
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
