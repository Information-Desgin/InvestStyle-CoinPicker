"use client";

import { useState } from "react";

type InvestStyle = "aggressive" | "stable" | "cautious" | "neutral";

export default function InvestStyleSelector({
  value,
  onChange,
}: {
  value: InvestStyle;
  onChange: (v: InvestStyle) => void;
}) {
  return (
    <div className="relative w-[180px] h-[100px] text-white">
      {/* --- 중앙 십자선(기본 그리드) --- */}
      <div className="absolute top-1/2 left-0 w-full h-[2px] bg-point300"></div>
      <div className="absolute top-0 left-1/2 h-full w-[2px] bg-point300"></div>

      {/* 그리드 */}
      <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
        <Quadrant
          label="Aggressive"
          active={value === "aggressive"}
          onClick={() => onChange("aggressive")}
          position="top-left"
        />
        <Quadrant
          label="Stable"
          active={value === "stable"}
          onClick={() => onChange("stable")}
          position="top-right"
        />
        <Quadrant
          label="Cautious"
          active={value === "cautious"}
          onClick={() => onChange("cautious")}
          position="bottom-left"
        />
        <Quadrant
          label="Neutral"
          active={value === "neutral"}
          onClick={() => onChange("neutral")}
          position="bottom-right"
        />
      </div>
    </div>
  );
}

function Quadrant({
  label,
  active,
  onClick,
  position,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}) {
  const radius =
    position === "top-left"
      ? "rounded-tl-[14px]"
      : position === "top-right"
      ? "rounded-tr-[14px]"
      : position === "bottom-left"
      ? "rounded-bl-[14px]"
      : "rounded-br-[14px]";

  const borderClass = active ? "border-2 border-point300 bg-[#3A4455]" : "";

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center ${radius} ${borderClass} text-[12px] cursor-pointer`}
    >
      {label}
    </button>
  );
}
