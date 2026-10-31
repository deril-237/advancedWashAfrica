import { type ReactNode } from "react";
import { type TableByColumnsProps, TableByColumns } from "./Table";
import { TablePagination, PaginationProps } from "./Paginaition";
import { CardList } from "./CardList";
import { CardPagination } from "./Paginaition/CardPagination";

export type MobileVersionProps<T> = { item: T; index: number };

interface DataTableProps<T> extends Omit<
  TableByColumnsProps<T>,
  "data" | "startIndex"
> {
  data: T[];
  pagination?: PaginationProps;
  showPagination?: boolean;
  mobileView?: (props: MobileVersionProps<T>) => ReactNode;
  mobileLoadingComponent?: ReactNode;
}

export type MobileView<T> = (item: T) => ReactNode;

export function DataTable<T>({
  pagination,
  showPagination = true,
  data,
  mobileView,
  mobileLoadingComponent,
  ...tableProps
}: DataTableProps<T>) {
  const startIndex =
    showPagination && pagination
      ? (pagination.currentPage - 1) * pagination.perPage
      : 0;

  const hasPagination = showPagination && pagination && pagination.total;

  return (
    <div className="w-full">
      <div
        className={`${mobileView ? "hidden md:block" : ""} w-full overflow-hidden rounded-xl  shadow-sm`}
      >
        <div className={`overflow-x-auto pb-10 bg-base-100`}>
          <TableByColumns startIndex={startIndex} data={data} {...tableProps} />
          {hasPagination ? <TablePagination {...pagination} /> : <></>}
        </div>
      </div>
      {mobileView && (
        <div className="md:hidden space-y-4">
          <CardList
            data={data}
            showPagination={showPagination}
            render={mobileView}
            isLoading={tableProps.isLoading}
            emptyMessage={tableProps.emptyMessage}
            loadingComponent={mobileLoadingComponent}
          />
          {hasPagination ? <CardPagination {...pagination} /> : null}
        </div>
      )}
    </div>
  );
}
