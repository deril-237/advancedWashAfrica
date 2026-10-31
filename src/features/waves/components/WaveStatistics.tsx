"use client";

import { useGetStatistics } from "../hooks";
import { BadgeStatistics } from "@/components/atoms/BadgeStatistics";

export function WaveStatistics() {
  const { isFetching, data: statistics, error } = useGetStatistics();

  return (
    <div className="flex flex-col md:grid md:grid-cols-3 flex-wrap gap-4">
      {isFetching ? (
        <WaveStatisticsSkeleton />
      ) : (
        <>
          <div>
            <BadgeStatistics
              variant="primary"
              title="Ouvert"
              subtitle={statistics?.nbOpen.toString() ?? ""}
            />
          </div>
          <div>
            <BadgeStatistics
              variant="warning"
              title="En cours"
              subtitle={statistics?.nbPending.toString() ?? ""}
            />
          </div>
          <div>
            <BadgeStatistics
              variant="error"
              title="Terminées"
              subtitle={statistics?.nbFinish.toString() ?? ""}
            />
          </div>
        </>
      )}
    </div>
  );
}

export function WaveStatisticsSkeleton() {
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
      <div className="skeleton w-full h-30">
        <div className="bg-white h-6 w-40 rounded-sm"></div>
        <div className="bg-white h-4 w-20 rounded-sm"></div>
      </div>
    </>
  );
}
