import { type ReactNode } from "react";

export default function InfoRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/8 text-primary shrink-0 ring-1 ring-primary/10">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-base-content/45 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-sm font-medium text-base-content truncate">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}
