type TooltipContainerProps = {
  title?: React.ReactNode;
  children: React.ReactNode;
};

export function TooltipContainer({ title, children }: TooltipContainerProps) {
  return (
    <div className="border-point bg-black/70 border rounded-[5px] p-4 min-w-[150px]">
      {title && <div className="font-chainname-bold mb-2">{title}</div>}

      {children}
    </div>
  );
}
