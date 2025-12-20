import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { COINS } from "../../data/coins";
import { useSelectedCoins } from "../../store/useSelectedCoins";

export default function BubbleChartD3() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { selectedIds } = useSelectedCoins();

  const data = [
    { symbol: "atom", internal: 92, external: 78, marketCap: 8200 },
    { symbol: "osmo", internal: 35, external: 90, marketCap: 2600 },
    { symbol: "inj", internal: 88, external: 32, marketCap: 9000 },
    { symbol: "tia", internal: 67, external: 55, marketCap: 4500 },
    { symbol: "sei", internal: 40, external: 95, marketCap: 1800 },
    { symbol: "axl", internal: 58, external: 72, marketCap: 3100 },
    { symbol: "kava", internal: 20, external: 50, marketCap: 900 },
    { symbol: "akt", internal: 76, external: 15, marketCap: 5000 },
    { symbol: "saga", internal: 33, external: 22, marketCap: 700 },
    { symbol: "ntrn", internal: 55, external: 60, marketCap: 1700 },
    { symbol: "strd", internal: 12, external: 35, marketCap: 400 },
    { symbol: "luna", internal: 48, external: 18, marketCap: 1500 },
    { symbol: "coreum", internal: 29, external: 82, marketCap: 1200 },
    { symbol: "althea", internal: 18, external: 58, marketCap: 600 },
    { symbol: "om", internal: 90, external: 28, marketCap: 7200 },
    { symbol: "atone", internal: 63, external: 48, marketCap: 2600 },
  ];

  useEffect(() => {
    if (!ref.current) return;
    d3.select(ref.current).selectAll("*").remove();

    const width = 700;
    const height = 470;
    const margin = 80;

    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    /* ------------------ Scale ------------------ */
    const x = d3
      .scaleLinear()
      .domain([0, 100])
      .range([margin, width - margin]);

    const y = d3
      .scaleLinear()
      .domain([0, 100])
      .range([height - margin, margin]);

    const radius = d3.scaleSqrt().domain([400, 9000]).range([10, 70]);

    /* ------------------ Axis ------------------ */
    const xAxis = svg
      .append("g")
      .attr("transform", `translate(0, ${height / 2})`)
      .call(d3.axisBottom(x).ticks(5));

    const yAxis = svg
      .append("g")
      .attr("transform", `translate(${width / 2}, 0)`)
      .call(d3.axisLeft(y).ticks(5));

    // 축 스타일
    [xAxis, yAxis].forEach((axis) => {
      axis.select(".domain").attr("stroke", "#9ca3af");
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
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .attr("fill", "#d1d5db")
      .attr("font-size", "var(--text-md)")
      .attr("font-weight", 300)
      .attr("font-family", "var(--font-sub)")
      .text("External Stability");

    const internalLabel = svg
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
    svg
      .append("line")
      .attr("x1", x(50))
      .attr("x2", x(50))
      .attr("y1", margin)
      .attr("y2", height - margin)
      .attr("stroke", "#6b7280")
      .attr("stroke-width", 1.5);

    svg
      .append("line")
      .attr("x1", margin)
      .attr("x2", width - margin)
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
      text-white
      text-[13px]
  `
      )
      .style("opacity", 0);

    const getOpacity = (symbol: string) => {
      if (selectedIds.length === 0) return 0.85;
      return selectedIds.includes(symbol) ? 1 : 0.15;
    };

    /* ------------------ Bubbles ------------------ */
    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.external))
      .attr("cy", (d) => y(d.internal))
      .attr("r", (d) => radius(d.marketCap))
      .attr("fill", (d) => COINS[d.symbol].color)
      .attr("opacity", (d) => getOpacity(d.symbol))
      .on("mouseover", (event, d) => {
        tooltip.style("opacity", 1).html(
          `<strong>${d.symbol.toUpperCase()}</strong><br/>
             Internal: ${d.internal}<br/>
             External: ${d.external}<br/>
             MarketCap: ${d.marketCap.toLocaleString()}`
        );
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", event.pageX + 12 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", () => tooltip.style("opacity", 0));

    /* ------------------ Labels ------------------ */
    svg
      .selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("x", (d) => x(d.external))
      .attr("y", (d) => y(d.internal))
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#ffffff")
      .attr("font-size", 10)
      .attr("font-family", "var(--font-sub)")
      .attr("opacity", (d) => getOpacity(d.symbol))
      .text((d) => d.symbol.toUpperCase());
  }, [selectedIds]);

  return <div ref={ref} />;
}
