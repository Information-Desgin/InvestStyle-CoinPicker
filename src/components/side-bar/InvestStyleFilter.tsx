"use client";

type InvestStyle = "aggressive" | "stable" | "cautious" | "neutral";

export default function InvestStyleSelector({
  value,
  onChange,
}: {
  value: InvestStyle;
  onChange: (v: InvestStyle) => void;
}) {
  return (
    <div className="relative w-full h-[100px] text-white">
      {/* 십자 구분선 */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-point"></div>
      <div className="absolute top-0 left-1/2 h-full w-[1px] bg-point"></div>

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
      ? "rounded-tl-[3px]"
      : position === "top-right"
      ? "rounded-tr-[3px]"
      : position === "bottom-left"
      ? "rounded-bl-[3px]"
      : "rounded-br-[3px]";

  // 액티브일 때 border 방향 지정
  const activeBorders = active
    ? position === "top-left"
      ? "border-t border-l border-point"
      : position === "top-right"
      ? "border-t border-r border-point"
      : position === "bottom-left"
      ? "border-b border-l border-point"
      : "border-b border-r border-point"
    : "";

  const activeBg = active ? "bg-box-clicked" : "";

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center ${radius} ${activeBorders} ${activeBg} font-element-light cursor-pointer`}
    >
      {label}
    </button>
  );
}
