import React from "react";
import { LoadingRow, EmptyRow } from "./shared";

export type TableByRowsProps<T> = {
  startIndex?: number;
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  keyExtractor?: (item: T, index: number) => string | number;
  columnsCount: number;
  renderRow: (item: T, index: number) => React.ReactNode;
  renderHeader: () => React.ReactNode;
};

export function TableByRows<T>({
  startIndex = 0,
  data,
  isLoading = false,
  emptyMessage = "Data is unavailable",
  keyExtractor = (_, index) => index,
  columnsCount,
  renderRow,
  renderHeader,
}: TableByRowsProps<T>) {
  return (
    <table className="w-full text-sm">
      {renderHeader()}

      <tbody className="bg-base-100 divide-y divide-base-300">
        {isLoading ? (
          <LoadingRow colSpan={columnsCount} />
        ) : data.length === 0 ? (
          <EmptyRow colSpan={columnsCount} emptyMessage={emptyMessage} />
        ) : (
          data.map((item, index) => (
            <React.Fragment key={keyExtractor(item, index)}>
              {renderRow(item, startIndex + index)}
            </React.Fragment>
          ))
        )}
      </tbody>
    </table>
  );
}
