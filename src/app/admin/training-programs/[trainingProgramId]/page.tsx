import { getTrainingProgramDetailsAction } from "@/features/trainings";
import { TitlePage } from "@/components/atoms/TitlePage";
import {
  GraduationCap,
  Clock,
  CircleDollarSign,
  PencilIcon,
} from "lucide-react";
import Image from "next/image";
import { ModuleList } from "@/features/modules";
import { PreRequestList } from "@/features/preRequests";
import { CarrerOpportunityList } from "@/features/carrerOpportunies";
import { notFound } from "next/navigation";
import { ButtonOpenModal } from "@/components/molecules";
import { TrainingProgramItem } from "@/features/trainings/types";

export default async function TrainingProgramDetailPage(props: {
  params: Promise<{ trainingProgramId: string }>;
}) {
  const { trainingProgramId } = await props.params;
  const { data: trainingProgram, serverError } =
    await getTrainingProgramDetailsAction(trainingProgramId);

  if (serverError || !trainingProgram) {
    notFound();
  }

  const { training, program, id } = trainingProgram;

  return (
    <div className="font-sans space-y-6">
      <TitlePage
        title={training.name + ` Parcours: ${program.duration} mois`}
        description="Détails du programme, objectif et modules de formation"
        icon={<GraduationCap size={22} />}
      />

      <TrainingProgramHeader
        id={id}
        training={training}
        program={program}
        price={trainingProgram.price}
      />

      <PreRequestList trainingProgramId={id} />

      <CarrerOpportunityList trainingProgramId={id} />

      <ModuleList trainingProgramId={id} />
    </div>
  );
}

type TrainingProgramHeaderProps = TrainingProgramItem;

function TrainingProgramHeader(trainingProgram: TrainingProgramHeaderProps) {
  return (
    <div className="rounded-xl border border-base-300 bg-base-100 shadow-sm overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Visuel */}
        <div className="relative w-full md:w-64 h-40 md:h-auto shrink-0 bg-base-200">
          {trainingProgram.training.image ? (
            <Image
              src={trainingProgram.training.image.url}
              alt={trainingProgram.training.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-base-content/30 bg-primary">
              <GraduationCap size={40} className="text-secondary" />
            </div>
          )}
        </div>

        {/* Infos */}
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
            <h2 className="font-heading text-xl font-semibold text-base-content">
              {trainingProgram.training.name}
            </h2>

            <div className="badge badge-soft badge-sm py-1 h-auto flex items-center gap-2 text-sm text-base-content/70 leading-relaxed">
              <div className="flex gap-2 text-base">
                <CircleDollarSign
                  size={20}
                  className="text-primary shrink-0 mt-0.5"
                />
                <p>{trainingProgram.price} XAF</p>
              </div>

              <ButtonOpenModal
                modalProps={trainingProgram}
                className="btn btn-xs border-none bg-transparent"
                modal="updateTrainingProgram"
              >
                <PencilIcon size={16} />
              </ButtonOpenModal>
            </div>
          </div>

          <div className="py-2 badge badge-soft badge-secondary gap-1.5 whitespace-nowrap">
            <Clock size={13} />
            <p> {trainingProgram.program.duration} mois</p>
          </div>
        </div>
      </div>
    </div>
  );
}
