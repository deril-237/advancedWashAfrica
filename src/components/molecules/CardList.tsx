import { ReactNode } from "react";

export type MobileVersionProps<T> = { item: T; index: number };

interface MobileListProps<T> {
  data: T[];
  render: (props: MobileVersionProps<T>) => ReactNode;
  isLoading?: boolean;
  emptyMessage?: string;
  loadingComponent?: ReactNode;
  showPagination?: boolean;
}

export function CardList<T>({
  render: mobileView,
  data,
  isLoading,
  loadingComponent,
  emptyMessage = "Data is unavailable",
}: MobileListProps<T>) {
  return (
    <div className="bg-base-100 w-full space-y-8">
      {isLoading ? (
        (loadingComponent ?? (
          <div className="w-full flex justify-center">
            <span className="spinner spinner-primary"></span>
          </div>
        ))
      ) : data.length === 0 ? (
        <div className="w-full flex justify-center py-8 text-neutral text-sm">
          {emptyMessage}
        </div>
      ) : (
        <>
          <div className="w-full flex flex-row flex-wrap gap-4">
            {data.map((item, index) => (
              <div className="max-md:w-full relative" key={index}>
                {mobileView({ item, index })}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
