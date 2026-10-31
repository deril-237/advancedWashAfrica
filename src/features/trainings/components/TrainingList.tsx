"use client";

import { useState } from "react";
import { GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";
import { useGetTrainingList } from "../hooks";
import { TrainingCard } from "./TrainingCard";
import { FIRST_PAGE } from "@/lib/pagination";

export function TrainingListComponent() {
  const [page, setPage] = useState(FIRST_PAGE);
  const { data, isLoading, isError, isPlaceholderData } =
    useGetTrainingList(page);

  if (isLoading) {
    return <TrainingListSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="rounded-xl border border-error/20 bg-error/5 p-6 text-sm text-error font-sans">
        Impossible de charger les formations. Réessaie dans un instant.
      </div>
    );
  }

  const { rows: trainings, meta } = data;

  if (trainings.length === 0) {
    return <TrainingsEmptyState />;
  }

  return (
    <div className="space-y-6">
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 transition-opacity duration-200 ${
          isPlaceholderData ? "opacity-60" : "opacity-100"
        }`}
      >
        {trainings.map((training) => (
          <TrainingCard key={training.id} training={training} />
        ))}
      </div>

      <TrainingsPagination
        meta={meta}
        onPrevious={() => setPage((p) => Math.max(FIRST_PAGE, p - 1))}
        onNext={() => setPage((p) => p + 1)}
      />
    </div>
  );
}

function TrainingsPagination({
  meta,
  onPrevious,
  onNext,
}: {
  meta: {
    currentPage: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    startIndex: number;
    endIndex: number;
    totalItems: number;
  };
  onPrevious: () => void;
  onNext: () => void;
}) {
  if (meta.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between font-sans text-sm">
      <p className="text-base-content/60">
        {meta.startIndex}–{meta.endIndex} sur {meta.totalItems} formations
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={onPrevious}
          disabled={!meta.hasPreviousPage}
          className="btn btn-sm btn-ghost border border-base-300 disabled:opacity-40 text-primary"
        >
          <ChevronLeft size={16} />
          Précédent
        </button>

        <span className="px-2 text-base-content/70">
          Page {meta.currentPage} / {meta.totalPages}
        </span>

        <button
          onClick={onNext}
          disabled={!meta.hasNextPage}
          className="btn btn-sm btn-ghost border border-base-300 disabled:opacity-40 text-primary"
        >
          Suivant
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function TrainingListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-base-300 bg-base-100 overflow-hidden animate-pulse"
        >
          <div className="h-40 bg-base-200" />
          <div className="p-5 space-y-3">
            <div className="h-4 w-3/4 bg-base-200 rounded" />
            <div className="h-3 w-full bg-base-200 rounded" />
            <div className="h-3 w-2/3 bg-base-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function TrainingsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-base-300 bg-base-100 py-16 text-center">
      <div className="rounded-full bg-primary/10 p-4">
        <GraduationCap size={28} className="text-primary" />
      </div>
      <p className="font-heading text-lg text-base-content">
        Aucune formation pour l'instant
      </p>
      <p className="font-serif text-sm text-base-content/60 max-w-sm">
        Les formations que tu crées apparaîtront ici, avec leurs programmes
        associés.
      </p>
    </div>
  );
}
