import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { COINS } from "../../data/coins";
import { useSelectedCoins } from "../../store/useSelectedCoins";
import type { AnalyticsSummary } from "../side-bar/SideBar";

type BubbleDatum = {
  symbol: string;
  internal: number; // 0~100
  external: number; // 0~100
  marketCap: number;
};

export default function BubbleChartD3({
  summaries,
}: {
  summaries: Record<string, AnalyticsSummary>;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { selectedIds } = useSelectedCoins();

  const data: BubbleDatum[] = Object.entries(summaries).map(([coinId, s]) => ({
    symbol: coinId,
    internal: s.internalAvg * 100,
    external: s.externalAvg * 100,
    marketCap: s.marketCapAvg,
  }));

  useEffect(() => {
    if (!ref.current || data.length === 0) return;
    d3.select(ref.current).selectAll("*").remove();

    const width = 700;
    const height = 480;
    const xMargin = 50;
    const yMargin = 70;

    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const root = svg.append("g").attr("transform", "translate(-10, 30)");

    /* ------------------ Scale ------------------ */
    const x = d3
      .scaleLinear()
      .domain([50, 100])
      .range([xMargin, width - xMargin]);

    const y = d3
      .scaleLinear()
      .domain([0, 100])
      .range([height - yMargin, yMargin]);

    // 중심 기준 증폭
    const amplify = (v: number, factor = 1.8) =>
      Math.max(0, Math.min(100, 50 + (v - 50) * factor));

    const radius = d3
      .scaleLog()
      .domain([
        Math.max(1, d3.min(data, (d) => d.marketCap)!),
        d3.max(data, (d) => d.marketCap)!,
      ])
      .range([12, 60]);

    /* ------------------ Axis ------------------ */
    const xAxis = root
      .append("g")
      .attr("transform", `translate(0, ${height / 2})`)
      .call(d3.axisBottom(x).ticks(5));

    const yAxis = root
      .append("g")
      .attr("transform", `translate(${width / 2}, 0)`)
      .call(d3.axisLeft(y).ticks(5));

    [xAxis, yAxis].forEach((axis) => {
      axis
        .selectAll(".tick line")
        .attr("stroke", "#b3b3b3")
        .attr("stroke-dasharray", "2 2");
      axis
        .selectAll(".tick text")
        .attr("fill", "#b3b3b3")
        .attr("font-size", 11)
        .attr("font-family", "var(--font-sub)");
    });

    /* ------------------ Axis Labels ------------------ */
    root
      .append("text")
      .attr("x", width / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .attr("fill", "#d1d5db")
      .attr("font-size", "var(--text-md)")
      .attr("font-weight", 300)
      .attr("font-family", "var(--font-sub)")
      .text("External Stability");

    const internalLabel = root
      .append("text")
      .attr("x", width - 20)
      .attr("y", height / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#d1d5db")
      .attr("font-size", "var(--text-md)")
      .attr("font-weight", 300)
      .attr("font-family", "var(--font-sub)");

    internalLabel
      .append("tspan")
      .attr("x", width - 20)
      .text("Internal");
    internalLabel
      .append("tspan")
      .attr("x", width - 20)
      .attr("dy", "1.4em")
      .text("Stability");

    /* ------------------ Quadrant Lines ------------------ */
    root
      .append("line")
      .attr("x1", x(75))
      .attr("x2", x(75))
      .attr("y1", yMargin)
      .attr("y2", height - yMargin)
      .attr("stroke", "#6b7280")
      .attr("stroke-width", 1.5);

    root
      .append("line")
      .attr("x1", xMargin)
      .attr("x2", width - xMargin)
      .attr("y1", y(50))
      .attr("y2", y(50))
      .attr("stroke", "#6b7280")
      .attr("stroke-width", 1.5);

    /* ------------------ Tooltip ------------------ */
    const tooltip = d3
      .select("body")
      .append("div")
      .attr(
        "class",
        `
        pointer-events-none fixed z-50
        border border-point
        bg-black/70
        rounded-[5px]
        p-4
        min-w-[150px]
      `
      )
      .style("opacity", 0);

    const getOpacity = (symbol: string) => {
      if (selectedIds.length === 0) return 0.85;
      return selectedIds.includes(symbol) ? 1 : 0.15;
    };

    /* ------------------ Bubbles ------------------ */
    root
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(amplify(d.internal)))
      .attr("cy", (d) => y(amplify(d.external)))
      .attr("r", (d) => radius(d.marketCap))
      .attr("fill", (d) => COINS[d.symbol as keyof typeof COINS].color)
      .attr("opacity", (d) => getOpacity(d.symbol))
      .on("mouseover", (_, d) => {
        tooltip.style("opacity", 1).html(`
          <div>
            <div class="font-chainname-bold mb-2">${d.symbol.toUpperCase()}</div>
            <div class="space-y-1 font-body1-light">
              <div>Internal: ${d.internal.toFixed(1)}</div>
              <div>External: ${d.external.toFixed(1)}</div>
              <div>MarketCap: ${d.marketCap.toLocaleString()}</div>
            </div>
          </div>
        `);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", event.pageX + 12 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", () => tooltip.style("opacity", 0));

    /* ------------------ Labels ------------------ */
    root
      .selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("x", (d) => x(amplify(d.internal)))
      .attr("y", (d) => y(amplify(d.external)))
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#ffffff")
      .attr("font-size", 10)
      .attr("font-family", "var(--font-sub)")
      .attr("opacity", (d) => getOpacity(d.symbol))
      .text((d) => d.symbol.toUpperCase());
  }, [selectedIds, data]);

  return <div ref={ref} />;
}
