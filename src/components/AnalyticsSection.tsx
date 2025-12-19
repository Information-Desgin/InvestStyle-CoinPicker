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
    <section className="w-full h-full">
      <header className="flex items-start">
        <div>
          <div className="">
            <span>{subtitle} </span>
            {title}
          </div>
          {description && <p className="break-all">{description}</p>}
        </div>
        {togglebtns}
      </header>

      {children}
    </section>
  );
}
