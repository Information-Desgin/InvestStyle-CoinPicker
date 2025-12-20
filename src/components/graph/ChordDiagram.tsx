import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { COINS } from "../../data/coins";
import { useSelectedCoins } from "../../store/useSelectedCoins";

const keys = [
  "atom",
  "osmo",
  "inj",
  "tia",
  "sei",
  "axl",
  "kava",
  "akt",
  "saga",
  "ntrn",
  "strd",
  "luna",
  "coreum",
  "althea",
  "om",
  "atone",
];

const matrix = [
  [0, 40, 22, 10, 15, 30, 18, 12, 9, 25, 8, 17, 11, 6, 14, 20],
  [35, 0, 28, 14, 22, 18, 9, 11, 16, 20, 12, 8, 10, 7, 19, 13],
  [18, 25, 0, 20, 14, 30, 16, 10, 8, 12, 9, 5, 7, 6, 22, 15],
  [12, 18, 26, 0, 20, 14, 10, 16, 11, 9, 8, 6, 13, 7, 5, 17],
  [20, 12, 15, 18, 0, 28, 14, 9, 6, 10, 7, 8, 11, 5, 13, 16],
  [25, 14, 20, 12, 26, 0, 18, 16, 10, 7, 9, 13, 5, 8, 11, 15],
  [15, 18, 10, 14, 22, 16, 0, 12, 7, 6, 8, 11, 9, 5, 13, 19],
  [10, 12, 14, 20, 9, 18, 11, 0, 16, 7, 6, 8, 5, 12, 13, 14],
  [9, 16, 11, 14, 12, 10, 7, 18, 0, 5, 8, 6, 4, 7, 15, 11],
  [17, 22, 14, 10, 8, 13, 11, 9, 6, 0, 12, 5, 10, 7, 14, 18],
  [11, 9, 7, 8, 10, 6, 12, 5, 7, 14, 0, 9, 8, 4, 6, 13],
  [13, 7, 5, 6, 9, 15, 11, 8, 6, 5, 10, 0, 7, 11, 9, 12],
  [9, 10, 7, 11, 6, 5, 8, 4, 7, 12, 9, 8, 0, 6, 10, 15],
  [7, 9, 6, 5, 4, 8, 5, 9, 6, 10, 7, 12, 11, 0, 5, 9],
  [16, 14, 21, 8, 12, 19, 10, 13, 15, 11, 9, 6, 7, 5, 0, 22],
  [20, 15, 12, 18, 16, 10, 14, 9, 11, 13, 8, 12, 10, 7, 21, 0],
];

export default function ChordDiagramD3() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { selectedIds } = useSelectedCoins();

  useEffect(() => {
    const container = d3.select(ref.current);
    container.selectAll("*").remove();

    const width = 450;
    const height = 450;
    const outerRadius = Math.min(width, height) * 0.46;
    const innerRadius = outerRadius - 10;

    const svg = container
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    /* ---------- Chord ---------- */
    const chord = d3.chord().padAngle(0.05).sortSubgroups(d3.descending)(
      matrix
    );

    const arcGen = d3
      .arc<any>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);
    const ribbonGen = d3.ribbon<any>().radius(innerRadius);

    /* ---------- Opacity rules ---------- */
    const arcOpacity = (id: string) =>
      selectedIds.length === 0 ? 1 : selectedIds.includes(id) ? 1 : 0.1;

    const ribbonOpacity = (s: string, t: string) =>
      selectedIds.length === 0
        ? 0.7
        : selectedIds.includes(s) && selectedIds.includes(t)
        ? 0.9
        : 0.05;

    /* ---------- ARCS ---------- */
    svg
      .append("g")
      .selectAll("path")
      .data(chord.groups)
      .enter()
      .append("path")
      .attr("d", arcGen)
      .attr("fill", (d) => COINS[keys[d.index]].color)
      .attr("opacity", (d) => arcOpacity(keys[d.index]));

    /* ---------- LABEL PATH (원 둘레용) ---------- */
    const labelArc = d3
      .arc<any>()
      .innerRadius(outerRadius + 10)
      .outerRadius(outerRadius + 10);

    const labelGroup = svg.append("g");

    /* path 생성 */
    labelGroup
      .selectAll("path")
      .data(chord.groups)
      .enter()
      .append("path")
      .attr("id", (_, i) => `label-path-${i}`)
      .attr("d", labelArc)
      .attr("fill", "none");

    /* ---------- LABEL TEXT ---------- */
    labelGroup
      .selectAll("text")
      .data(chord.groups)
      .enter()
      .append("text")
      .attr("fill", "#fff")
      .attr("font-size", "var(--text-sm")
      .attr("font-weight", "var(--font-weight-medium)")
      .attr("font-family", "var(--font-sub")
      .attr("opacity", (d) => arcOpacity(keys[d.index]))
      .append("textPath")
      .attr("href", (_, i) => `#label-path-${i}`)
      .attr("startOffset", "25%")
      .attr("text-anchor", "middle")
      .attr("side", (d) => {
        const angle = (d.startAngle + d.endAngle) / 2;
        return angle > Math.PI / 2 && angle < (3 * Math.PI) / 2
          ? "right"
          : "left";
      })
      .text((d) => COINS[keys[d.index]].chain.toUpperCase());

    /* ---------- RIBBONS ---------- */
    svg
      .append("g")
      .selectAll("path")
      .data(chord)
      .enter()
      .append("path")
      .attr("d", ribbonGen)
      .attr("fill", (d) => COINS[keys[d.source.index]].color)
      .attr("opacity", (d) =>
        ribbonOpacity(keys[d.source.index], keys[d.target.index])
      );
  }, [selectedIds]);

  return <div ref={ref} />;
}
