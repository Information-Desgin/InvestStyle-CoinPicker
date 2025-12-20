type TooltipContainerProps = {
  title?: React.ReactNode;
  children: React.ReactNode;
};

export function TooltipContainer({ title, children }: TooltipContainerProps) {
  return (
    <div className="border-point bg-black/50 border rounded-[5px] p-4">
      {title && <div className="font-body1-light">{title}</div>}

      {children}
    </div>
  );
}
