"use client";

import { useGetStudentStatistics } from "../hooks";
import { BadgeStatistics } from "@/components/atoms/BadgeStatistics";

export function StudentStatistics() {
  const { isFetching, data: statistics, error } = useGetStudentStatistics();

  return (
    <div className="flex flex-col md:grid md:grid-cols-3 flex-wrap gap-4">
      {error ? (
        <>
          <div className="w-full badge badge-error badge-soft py-4">
            Error est survenue pendant les chargement des statistics
          </div>
        </>
      ) : null}
      {isFetching ? (
        <StudentStatisticsSkeleton />
      ) : (
        <>
          <div>
            <BadgeStatistics
              variant="primary"
              title="Total"
              subtitle={statistics?.totalStudent.toString() ?? ""}
            />
          </div>
          <div>
            <BadgeStatistics
              variant="warning"
              title="En cours de formation"
              subtitle={statistics?.totalStudentInTraining.toString() ?? ""}
            />
          </div>
        </>
      )}
    </div>
  );
}

export function StudentStatisticsSkeleton() {
  return (
    <>
      <div className="skeleton w-full h-30 rounded-lg shadow-xs px-1 py-1 space-y-8">
        <div className="bg-white h-6 w-40 rounded-sm"></div>
        <div className="bg-white h-4 w-20 rounded-sm"></div>
      </div>
      <div className="skeleton w-full h-30 rounded-lg shadow-xs px-2">
        <div className="bg-white h-6 w-40 rounded-sm"></div>
        <div className="bg-white h-4 w-20 rounded-sm"></div>
      </div>
    </>
  );
}
