interface MetricLabelProps {
  color: string;
  text: string;
}

export default function MetricLabel({ color, text }: MetricLabelProps) {
  return (
    <div className="flex items-center gap-[7px]">
      <div className={`w-[10px] h-[10px] rounded-full bg-${color}`} />
      <span className="text-[8px] text-white/80">{text}</span>
    </div>
  );
}
