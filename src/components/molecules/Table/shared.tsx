// shared.tsx
import React, { ReactNode } from "react";
import { Spinner } from "@/components/atoms/Spinner";
import { FolderOpen } from "lucide-react";

export type Column<T> = {
  key: string;
  label: ReactNode;
  align?: "left" | "center" | "right";
  renderCell?: (item: T, index: number) => React.ReactNode;
};

type TableSkeletonRowProps = {
  colSpan: number;
  rows?: number;
};

export const getAlignment = (align?: string) => {
  switch (align) {
    case "center":
      return "text-center";
    case "right":
      return "text-right";
    default:
      return "text-left";
  }
};

export function TableSkeletonRow({ colSpan, rows = 6 }: TableSkeletonRowProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="p-0">
        <div className="divide-y divide-base-300">
          {Array.from({ length: rows }).map((_, row) => (
            <div
              key={row}
              className="grid items-center"
              style={{
                gridTemplateColumns: `64px repeat(${colSpan - 1}, minmax(0,1fr))`,
              }}
            >
              {/* Numéro */}
              <div className="px-6 py-4 flex justify-center">
                <div className="skeleton size-8 rounded-full" />
              </div>

              {/* Colonnes */}
              {Array.from({ length: colSpan - 1 }).map((_, column) => (
                <div key={column} className="px-6 py-4">
                  <div className="skeleton h-4 w-full max-w-[180px]" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </td>
    </tr>
  );
}

export function LoadingRow({ colSpan }: { colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan}>
        <div className="w-full flex items-center justify-center py-16">
          <Spinner size="md" variant="dark" text="load data" />
        </div>
      </td>
    </tr>
  );
}

export function EmptyRow({
  colSpan,
  emptyMessage,
}: {
  colSpan: number;
  emptyMessage: React.ReactNode;
}) {
  return (
    <tr>
      <td colSpan={colSpan}>
        <div className="w-full flex flex-col items-center justify-center py-16 px-4">
          <FolderOpen className="w-16 h-16 text-base-300 mb-4" />
          <p className="text-lg text-center px-2 font-semibold text-neutral mb-2">
            {emptyMessage}
          </p>
        </div>
      </td>
    </tr>
  );
}
