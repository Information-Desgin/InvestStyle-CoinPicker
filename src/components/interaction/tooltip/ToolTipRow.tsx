type TooltipRowProps = {
  dotColor: string;
  label: React.ReactNode;
  value: string | number;
  subLabel?: React.ReactNode;
  isActive?: boolean;
};

export function TooltipRow({
  dotColor,
  label,
  value,
  subLabel,
  isActive = false,
}: TooltipRowProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        paddingTop: "5px",
        borderRadius: 8,
        background: isActive ? "rgba(96,165,250,0.12)" : "transparent",
      }}
      className="font-body1-bold"
    >
      {/* 점 */}
      <span
        style={{
          width: isActive ? 9 : 7,
          height: isActive ? 9 : 7,
          borderRadius: "50%",
          backgroundColor: dotColor,
          flexShrink: 0,
        }}
      />

      {/* 라벨 */}
      <span>{label}</span>

      {/* 보조 라벨*/}
      {subLabel && (
        <span style={{ opacity: 0.6, fontSize: 13 }}>{subLabel}</span>
      )}

      {/* 값 */}
      <span
        style={{
          marginLeft: "auto",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        }}
      >
        {value}
      </span>
    </div>
  );
}
