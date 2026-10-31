import React from "react";
import {
  Column,
  getAlignment,
  LoadingRow,
  EmptyRow,
  TableSkeletonRow,
} from "./shared";

export type TableByColumnsProps<T> = {
  startIndex?: number;
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  keyExtractor?: (item: T, index: number) => string | number;
};

export function TableByColumns<T>({
  startIndex = 0,
  columns,
  data,
  isLoading = false,
  emptyMessage = "Data is unavailable",
  keyExtractor = (_, index) => index,
}: TableByColumnsProps<T>) {
  const colSpan = columns.length + 1;

  return (
    <table className="w-full text-sm">
      <thead className="bg-primary border-b-2 border-primary text-primary-content border-opacity-20">
        <tr>
          <th className="px-6 py-4 text-center text-xs font-bold text-primary-content uppercase tracking-wider">
            N°
          </th>
          {columns.map((column) => (
            <th
              key={column.key}
              className={`px-6 py-4 ${getAlignment(column.align)} text-xs font-bold uppercase tracking-wider`}
            >
              {column.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="bg-base-100 divide-y divide-base-300">
        {isLoading ? (
          <TableSkeletonRow colSpan={columns.length + 1} rows={6} />
        ) : data.length === 0 ? (
          <EmptyRow colSpan={colSpan} emptyMessage={emptyMessage} />
        ) : (
          data.map((item, index) => (
            <tr
              key={keyExtractor(item, index)}
              className="duration-150 hover:bg-primary/5 hover:bg-opacity-50 hover:cursor-pointer group border-b border-border/40 transition-colors"
            >
              <td className="px-6 py-4 text-center">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-content  font-semibold text-sm transition-colors">
                  {startIndex + index + 1}
                </div>
              </td>
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`px-6 py-4 ${getAlignment(column.align)}`}
                >
                  {column.renderCell ? column.renderCell(item, index) : null}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
