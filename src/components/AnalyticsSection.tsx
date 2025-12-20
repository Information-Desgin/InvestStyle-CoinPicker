type AnalyticsSectionProps = {
  title: string;
  subtitle?: string;
  description?: string;
  togglebtns?: React.ReactNode;
  children: React.ReactNode;
};

export function AnalyticsSection({
  title,
  subtitle,
  description,
  togglebtns,
  children,
}: AnalyticsSectionProps) {
  return (
    <section className="w-full h-full p-7 flex flex-col">
      <header className="flex items-start">
        <div className="flex flex-col gap-[14px]">
          <div className="font-subtitle">
            <span className="text-point-text">{subtitle} </span>
            {title}
          </div>
          {description && (
            <div className="break-all font-element-light">{description}</div>
          )}
        </div>
        {togglebtns}
      </header>

      <div className="flex-1 w-full flex justify-center items-center">
        {children}
      </div>
    </section>
  );
}
