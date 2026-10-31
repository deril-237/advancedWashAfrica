"use server";

import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { GraduationCap, ArrowRight } from "lucide-react";
import { unwrap } from "@/lib/safeAction";
import { getTopTrainingsAction } from "@/features/trainings";

function TopTrainingProgramSkeleton() {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="h-6 w-52 rounded bg-base-200 animate-pulse" />
        <div className="h-4 w-16 rounded bg-base-200 animate-pulse" />
      </div>

      <ul className="list bg-base-100 rounded-box shadow-md">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="list-row items-center">
            <div className="size-10 rounded-lg bg-base-200 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 rounded bg-base-200 animate-pulse" />
              <div className="h-2 w-full rounded bg-base-200 animate-pulse" />
            </div>
            <div className="h-4 w-8 rounded bg-base-200 animate-pulse" />
          </li>
        ))}
      </ul>
    </div>
  );
}

async function TopTrainingProgramContent() {
  const trainings = await unwrap(getTopTrainingsAction(5));

  const maxCount = Math.max(...trainings.map((t) => t.inscriptionCount), 1);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-semibold text-lg">Formations les plus demandées</h1>
        <Link
          href="/admin/trainings"
          className="text-sm text-primary flex items-center gap-1 hover:underline"
        >
          Voir tout <ArrowRight size={14} />
        </Link>
      </div>

      <ul className="list bg-base-100 rounded-box shadow-md">
        {trainings.length === 0 && (
          <li className="list-row p-6 text-center text-base-content/60">
            Aucune donnée disponible
          </li>
        )}

        {trainings.map((training, index) => {
          const percent = Math.round(
            (training.inscriptionCount / maxCount) * 100,
          );

          return (
            <li key={training.id} className="list-row items-center">
              <div className="avatar">
                <div className="size-10 rounded-lg bg-base-200">
                  {training.image?.url ? (
                    <Image
                      src={training.image.url}
                      alt={training.name}
                      width={40}
                      height={40}
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <GraduationCap
                        size={18}
                        className="text-base-content/40"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">
                    <span className="text-base-content/40 mr-1">
                      #{index + 1}
                    </span>
                    {training.name}
                  </p>
                  <span className="text-sm font-semibold">
                    {training.inscriptionCount}
                  </span>
                </div>
                <progress
                  className="progress progress-primary/80 w-full h-1.5 mt-1"
                  value={percent}
                  max={100}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export async function TopTrainingProgram() {
  return (
    <Suspense fallback={<TopTrainingProgramSkeleton />}>
      <TopTrainingProgramContent />
    </Suspense>
  );
}
