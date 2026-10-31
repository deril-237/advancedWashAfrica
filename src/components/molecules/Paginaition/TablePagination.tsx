// pagination/TablePagination.tsx
"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";
import { PaginationProps } from "./shared";

export function TablePagination({
  currentPage,
  firstPage,
  lastPage,
  startIndex,
  endIndex,
  total,
  perPage,
  getPageNumbers,
  goToPage,
  goToFirstPage,
  goToPreviousPage,
  goToNextPage,
  goToLastPage,
}: PaginationProps) {
  const pageNumbers = getPageNumbers();

  return (
    <div className="px-6 py-4 flex items-center justify-between gap-4 border-t border-border bg-base-100">
      <div className="flex items-center gap-6">
        <div className="text-sm font-medium text-base-content">
          {startIndex} - {endIndex} sur {total}
        </div>
        <div className="text-sm text-base-content/70">
          {perPage} éléments par page
        </div>
      </div>

      <div className="join join-horizontal shadow-sm">
        <button
          onClick={goToFirstPage}
          disabled={currentPage === firstPage}
          className="join-item btn btn-sm btn-ghost"
          title="Première page"
          aria-label="Aller à la première page"
        >
          <ChevronsLeftIcon className="size-4" />
        </button>

        <button
          onClick={goToPreviousPage}
          disabled={currentPage === firstPage}
          className="join-item btn btn-sm btn-ghost"
          title="Page précédente"
          aria-label="Aller à la page précédente"
        >
          <ChevronLeftIcon className="size-4" />
        </button>

        <div className="join-item flex items-center">
          {pageNumbers.map((page, index) =>
            typeof page === "string" ? (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-base-content/50"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`join-item btn btn-sm ${
                  currentPage === page
                    ? "btn-active bg-primary text-primary-content"
                    : "btn-ghost"
                }`}
                aria-label={`Aller à la page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            ),
          )}
        </div>

        <button
          onClick={goToNextPage}
          disabled={currentPage === lastPage}
          className="join-item btn btn-sm btn-ghost"
          title="Page suivante"
          aria-label="Aller à la page suivante"
        >
          <ChevronRightIcon className="size-4" />
        </button>

        <button
          onClick={goToLastPage}
          disabled={currentPage === lastPage}
          className="join-item btn btn-sm btn-ghost"
          title="Dernière page"
          aria-label="Aller à la dernière page"
        >
          <ChevronsRightIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}
