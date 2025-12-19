interface MetricLabelProps {
  color: "internal" | "external" | "netflow";
  text: string;
}

const COLOR_CLASS_MAP = {
  internal: "bg-internal",
  external: "bg-external",
  netflow: "bg-netflow",
};

export default function MetricLabel({ color, text }: MetricLabelProps) {
  return (
    <div className="flex items-center gap-[7px] min-w-0">
      <div
        className={`w-[10px] h-[10px] rounded-full ${COLOR_CLASS_MAP[color]}`}
      />
      <span className="font-body3-light">{text}</span>
    </div>
  );
}
