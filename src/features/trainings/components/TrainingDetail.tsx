"use server";

import { Layers, PlusIcon } from "lucide-react";
import { TrainingDetailHeader } from "./TrainingDetailHeader";
import { TrainingProgramCard } from "./TrainingProgramCard";
import type { Identifier } from "@/interfaces/entities";
import { ButtonOpenModal } from "@/components/molecules";
import { getTrainingDetailsAction } from "../actions";
import { notFound } from "next/navigation";

export async function TrainingDetail({
  trainingId,
}: {
  trainingId: Identifier;
}) {
  // const {
  //   data: training,
  //   isLoading,
  //   isError,
  // } = useGetTrainingDetails(trainingId);

  const result = await getTrainingDetailsAction(trainingId);

  // if (isLoading) {
  //   return <TrainingDetailSkeleton />;
  // }

  if (result.validationErrors) {
    notFound();
  }

  if (result.serverError || !result.data) {
    return (
      <div className="rounded-xl border border-error/20 bg-error/5 p-6 text-sm text-error font-sans">
        Impossible de charger cette formation.
      </div>
    );
  }

  const training = result.data;
  return (
    <div className="space-y-6">
      <TrainingDetailHeader training={training} />

      <div className="space-y-3">
        <div className="flex justify-between">
          <h2 className="font-heading text-lg font-semibold text-base-content flex items-center gap-2">
            <Layers size={18} className="text-primary" />
            Programmes
          </h2>
          <ButtonOpenModal
            className="btn btn-primary btn-sm btn-soft"
            modal="addProgramInTraining"
            modalProps={{ trainingId: training.id }}
          >
            <PlusIcon size={20} />
            Ajouter
          </ButtonOpenModal>
        </div>
        {training.trainingPrograms.length === 0 ? (
          <p className="font-serif text-sm text-base-content/60">
            Aucun programme n'a encore été associé à cette formation.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {training.trainingPrograms.map((trainingProgram) => (
              <TrainingProgramCard
                key={trainingProgram.id}
                trainingProgram={trainingProgram}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
