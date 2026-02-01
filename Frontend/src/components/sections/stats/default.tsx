interface StatItemProps {
  label?: string;
  value: string | number;
  suffix?: string;
  description?: string;
}

interface StatsProps {
  items?: StatItemProps[] | false;
  className?: string;
}

export default function Stats({
  items = [
    {
      label: "used by",
      value: Math.round(100) / 10,
      suffix: "k",
      description: "designers on Figma Community",
    },
    {
      label: "over",
      value: 12000,
      description: "clones and forks of the template on Github",
    },
    {
      label: "already",
      value: Math.round(15000 / 100) / 10,
      suffix: "k",
      description: "installations with shadcn/ui CLI",
    },
    {
      label: "includes",
      value: 120,
      description: "blocks and sections",
    },
  ],
}: StatsProps) {
  return (
      <div className="mx-auto flex flex-col items-start gap-8 text-left">
        {items !== false && items.length > 0 && (
          <div className="flex flex-col gap-8 w-full pt-10">
            {items.map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-3">
                {item.label && (
                  <div className="text-muted-foreground text-sm font-semibold">
                    {item.label}
                  </div>
                )}
                <div className="flex items-baseline gap-2">
                  <div className="from-foreground to-foreground dark:to-brand bg-linear-to-r bg-clip-text text-4xl font-medium text-transparent drop-shadow-[2px_1px_24px_var(--brand-foreground)] transition-all duration-300 sm:text-5xl md:text-6xl">
                    {item.value}
                  </div>
                  {item.suffix && (
                    <div className="text-brand text-2xl font-semibold">
                      {item.suffix}
                    </div>
                  )}
                </div>
                {item.description && (
                  <div className="text-muted-foreground text-sm font-semibold text-pretty">
                    {item.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
  );
}
