// pagination/shared.ts
export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  firstPage: number;
  lastPage: number;
  startIndex: number;
  endIndex: number;
  total: number;
  perPage: number;
  getPageNumbers: () => (number | string)[];
  goToPage: (page: number) => void;
  goToFirstPage: () => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  goToLastPage: () => void;
};
