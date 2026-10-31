import { useCallback, useState } from "react";
import { DEFAULT_LIMIT, FIRST_PAGE } from "@/lib/pagination";

type ParamsPagination = {
  total: number;
  perPage?: number;
  onPageChange?: (page: number) => void;
  page: number;
};

export function usePagination({
  total,
  perPage = DEFAULT_LIMIT,
  onPageChange,
  page = FIRST_PAGE,
}: ParamsPagination) {
  // calculate number total page
  const totalPages = Math.ceil(total / perPage);

  // first page and last page
  const firstPage = FIRST_PAGE;
  const lastPage = totalPages;

  // utils identicators
  const hasNext = page < lastPage;
  const hasPrevious = page > firstPage;
  const startIndex = (page - 1) * perPage + 1;
  const endIndex = Math.min(startIndex + perPage, total);

  const nextFunction = useCallback(() => {
    if (!hasNext) return;

    const nextPage = page + 1;
    onPageChange?.(nextPage);
  }, [page, hasNext, onPageChange]);

  const previousFunction = useCallback(() => {
    if (!hasPrevious) return;

    const prevPage = page - 1;
    onPageChange?.(prevPage);
  }, [page, hasPrevious, onPageChange]);

  const goToPage = useCallback(
    (targetPage: number) => {
      if (targetPage < firstPage || targetPage > lastPage) return;

      onPageChange?.(targetPage);
    },
    [totalPages, onPageChange],
  );
  const goToLastPage = useCallback(() => {
    goToPage(lastPage);
  }, [goToPage]);

  const goToFirstPage = useCallback(() => {
    goToPage(firstPage);
  }, [goToPage]);
  const reset = useCallback(() => {
    onPageChange?.(page);
  }, [page, onPageChange]);

  const getPageNumbers = useCallback(() => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    if (page <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i);
      pages.push("...");
      pages.push(totalPages);
    } else if (page >= totalPages - 2) {
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push("...");
      for (let i = page - 1; i <= page + 1; i++) pages.push(i);
      pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  }, [page, total]);

  return {
    currentPage: page, // current page
    perPage, // number element by page
    total, // total element
    totalPages, // numbers of page
    firstPage,
    lastPage,
    hasNext, // current page has next page exist
    hasPrevious, // current page has previous page
    startIndex, //  index of the first element in current page. if FIRST_PAGE == 0 startIndex = 0 otherwise start = 1
    endIndex, // index of the last element in current page if FIRST_PAGE == 0 endIndex = total -1 otherwise endIndex = total
    goToNextPage: nextFunction, // function executed when we want to pass to next page
    goToPreviousPage: previousFunction, // function executed when we want to pass to last page
    goToPage, // function executed when we want to pass to specific page
    reset, // reset params and to go to default page,
    goToLastPage, // function executrd wewant to pass to last page
    goToFirstPage, // function executrd wewant to pass to first page
    getPageNumbers, // get list the next page
  };
}
