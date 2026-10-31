// pagination/CardPagination.tsx
"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { PaginationProps } from "./shared";

export function CardPagination({
  currentPage,
  firstPage,
  lastPage,
  startIndex,
  endIndex,
  total,
  goToPreviousPage,
  goToNextPage,
}: PaginationProps) {
  if (total === 0) {
    return;
  }

  return (
    <div className="px-4 py-4 flex flex-col gap-3 border-border bg-base-200">
      <div className="text-xs text-base-content/60 text-center">
        {startIndex} - {endIndex} sur {total}
      </div>

      <div className="flex items-center justify-between gap-2">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === firstPage}
          className="btn btn-outline btn-primary btn-md flex-1"
          aria-label="Aller à la page précédente"
        >
          <ChevronLeftIcon className="size-5" />
          Précédent
        </button>

        <div
          className="flex items-center gap-1 px-3 shrink-0"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="badge badge-lg bg-secondary/20 text-secondary-content font-semibold border-0">
            {currentPage}
          </span>
          <span className="text-sm text-base-content/50">/ {lastPage}</span>
        </div>

        <button
          onClick={goToNextPage}
          disabled={currentPage === lastPage}
          className="btn btn-outline btn-primary btn-md flex-1"
          aria-label="Aller à la page suivante"
        >
          Suivant
          <ChevronRightIcon className="size-5" />
        </button>
      </div>
    </div>
  );
}
