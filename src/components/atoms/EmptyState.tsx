import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export default function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-base-100 shadow-sm px-8 py-16 text-center">
      {icon && (
        <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
      )}

      <div className="max-w-md">
        <h3 className="font-heading text-xl font-semibold text-base-content">
          {title}
        </h3>

        {description && (
          <p className="mt-3 text-sm leading-6 text-base-content/60">
            {description}
          </p>
        )}
      </div>

      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}
