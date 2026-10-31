import {
  getTrainingProgramListAction,
  TrainingProgramItem,
} from "@/features/trainings";
import Link from "next/link";
import { ArrowRight, GraduationCap, Folder } from "lucide-react";
import Image from "next/image";

export async function HomeTrainingList({
  limit = 6,
  displayTitle = false,
}: {
  limit?: number;
  displayTitle?: boolean;
}) {
  const result = await getTrainingProgramListAction(undefined, {
    limit,
  });

  if (result.serverError || !result.data || result.validationErrors) {
    throw new Error(
      "There are error when fetching the training programs list. Please check the server logs for more details.",
    );
  }

  return (
    <section className="bg-base-200 py-20" id={`trainings`}>
      <div className="mx-auto max-w-7xl px-6">
        {/* Header section */}

        <div className="mb-12 max-w-2xl">
          {/* <span className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            <span className="h-px w-8 bg-secondary" />
            Nos formations
          </span> */}
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Our training programs
          </h2>
          <span className="mt-2 inline-flex items-center gap-2 text-lg font-large text-primary">
            Developp your skills and prepare for your professional future
          </span>

          <p className="mt-4 text-base leading-7 text-base-content/60">
            Discover our training programs designed to help you develop
            practical, professional skills.
          </p>
        </div>

        {/* Cards */}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {result.data.meta.totalItems === 0 && <EmptyTrainings />}
          {result.data.rows.map((trainingProgram, index) => (
            <TrainingProgramCard
              key={trainingProgram.id}
              trainingProgram={trainingProgram}
              index={index}
            />
          ))}
        </div>

        {/* Button */}
        {displayTitle ? (
          <div className="mt-12 flex justify-center">
            <Link
              href="/trainings"
              className="btn btn-primary rounded-xl   px-8 shadow-lg shadow-primary/20"
            >
              All trainings programs
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function TrainingProgramCard({
  trainingProgram,
  index,
}: {
  trainingProgram: TrainingProgramItem;
  index: number;
}) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-primary/5">
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          {trainingProgram.training.image?.url ? (
            <Image
              src={trainingProgram.training.image.url}
              width={1000}
              height={1000}
              alt="formation"
              className="w-full h-full"
            />
          ) : (
            <GraduationCap size={64} strokeWidth={1} className="text-primary" />
          )}
        </div>

        {/* Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-52 bg-primary/20" />

        {/* Number */}
        <div className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-xl bg-white/90 shadow-sm backdrop-blur">
          <span className="text-sm font-black text-primary">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* <div className="mb-3 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-secondary" />

          <span className="text-xs font-bold uppercase tracking-[0.15em] text-primary/50">
            Formation
          </span>
        </div> */}

        <h3 className="text-xl font-bold leading-tight text-primary">
          {trainingProgram.training.name}
        </h3>

        {/* Duration */}
        <div className="mt-4 inline-flex items-center rounded-full bg-primary/5 px-3 py-1.5">
          <span className="text-xs font-semibold text-primary/70">
            Durée :{" "}
            <span className="text-primary">
              {trainingProgram.program.duration} mois
            </span>
          </span>
        </div>

        {/* Description */}
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-base-content/60">
          {trainingProgram.training.description}
        </p>

        {/* Action */}
        <Link
          href={`/trainings/${trainingProgram.id}`}
          className="mt-6 flex items-center gap-4 border-t border-base-300 pt-5 text-sm font-bold text-primary hover:underline"
        >
          <span>Discover this training</span>
          {/* <span>
            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </span> */}
          <span className="flex size-9 items-center justify-center rounded-full bg-primary/5 transition-all duration-300  ">
            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </span>
        </Link>
      </div>
    </article>
  );
}

export function TrainingProgramSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-base-300 bg-base-100">
      <div className="skeleton h-52 w-full" />

      <div className="space-y-4 p-6">
        <div className="skeleton h-3 w-20" />

        <div className="skeleton h-6 w-3/4" />

        <div className="skeleton h-7 w-24 rounded-full" />

        <div className="space-y-2">
          <div className="skeleton h-3 w-full" />
          <div className="skeleton h-3 w-5/6" />
          <div className="skeleton h-3 w-2/3" />
        </div>

        <div className="border-t border-base-300 pt-5">
          <div className="skeleton h-9 w-full" />
        </div>
      </div>
    </div>
  );
}

function EmptyTrainings() {
  return (
    <div className="rounded-2xl border border-dashed border-primary/20 bg-primary/5 px-6 py-10 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-content">
        <Folder size={26} />
      </div>

      <h3 className="mt-4 font-bold text-primary">
        Aucune formation disponible pour le moment
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-base-content/60">
        Aucun formation n'est disponible pour le moment. Veuillez revenir
        ultérieurement.
      </p>
    </div>
  );
}
