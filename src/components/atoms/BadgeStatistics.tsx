export type BadgeStatProps = {
  title: string;
  subtitle: string;
  variant: "warning" | "primary" | "error";
};

export function BadgeStatistics({ variant, title, subtitle }: BadgeStatProps) {
  const textColor: Record<BadgeStatProps["variant"], string> = {
    warning: "text-warning",
    primary: "text-primary",
    error: "text-error",
  };

  return (
    <div className="w-full h-30 rounded-lg shadow-xs px-4 py-2 space-y-4 bg-primary/10">
      <h4 className={`text-3xl h2 ${textColor[variant]} font-semibold`}>
        {title}
      </h4>
      <p className={`text-2xl ${textColor[variant]} font-medium`}>{subtitle}</p>
    </div>
  );
}
