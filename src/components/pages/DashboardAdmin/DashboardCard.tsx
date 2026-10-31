import Link from "next/link";
import { ArrowRight, LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import clsx from "clsx";

export type DashboardCardVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "info";

export type DashboardCardProps = {
  title: string;
  subtitle: string;
  href: string;
  icon: LucideIcon;
  variant?: DashboardCardVariant;
  children: ReactNode;
  actionLabel?: string;
};

const variants: Record<
  DashboardCardVariant,
  {
    card: string;
    icon: string;
    glow: string;
    link: string;
  }
> = {
  primary: {
    card: "bg-gradient-to-br from-primary to-primary/90 text-primary-content",
    icon: "bg-white/10 text-secondary",
    glow: "bg-secondary/20",
    link: "text-secondary",
  },

  secondary: {
    card: "bg-gradient-to-br from-secondary/50 to-amber-500 text-secondary-content",
    icon: "bg-white/40 text-primary",
    glow: "bg-white/30",
    link: "text-primary",
  },

  accent: {
    card: "bg-gradient-to-br from-accent to-accent/90 text-accent-content",
    icon: "bg-white/10 text-secondary",
    glow: "bg-secondary/20",
    link: "text-secondary",
  },

  success: {
    card: "bg-gradient-to-br from-success to-success/90 text-white",
    icon: "bg-white/10 text-secondary",
    glow: "bg-secondary/20",
    link: "text-secondary",
  },

  warning: {
    card: "bg-gradient-to-br from-warning to-yellow-700 text-white",
    icon: "bg-white/10 text-secondary",
    glow: "bg-secondary/20",
    link: "text-secondary",
  },

  info: {
    card: "bg-gradient-to-br from-info to-blue-700 text-white",
    icon: "bg-white/10 text-secondary",
    glow: "bg-secondary/20",
    link: "text-secondary",
  },
};

export default function DashboardCard({
  title,
  subtitle,
  href,
  icon: Icon,
  children,
  variant = "primary",
  actionLabel = "voir details",
}: DashboardCardProps) {
  const style = variants[variant];

  return (
    <div
      className={clsx(
        "group relative overflow-hidden rounded-2xl p-6",
        "shadow-lg ring-1 ring-white/10",
        "transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-2xl",
        style.card,
      )}
    >
      {/* Glow */}
      <div
        className={clsx(
          "absolute -right-12 -top-12 size-40 rounded-full blur-3xl",
          style.glow,
        )}
      />

      <div className="relative flex h-full flex-col gap-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div
            className={clsx(
              "flex size-14 items-center justify-center rounded-2xl backdrop-blur",
              style.icon,
            )}
          >
            <Icon size={28} />
          </div>

          <div>
            <h3 className="text-xl font-bold">{title}</h3>

            <p className="mt-1 text-sm opacity-80">{subtitle}</p>
          </div>
        </div>

        {/* Content */}
        <div className="w-full">{children}</div>

        {/* Footer */}
        <Link
          href={href}
          className={clsx(
            "inline-flex items-center gap-2 font-medium transition-all",
            "group-hover:translate-x-1",
            style.link,
          )}
        >
          {actionLabel}
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
