import Image from "next/image";
import { GraduationCap, Target, Layers, Pencil } from "lucide-react";
import { ButtonOpenModal } from "@/components/molecules";
import { TrainingListItem } from "../types";
import { ServerFileAsset } from "@/features/fileAssets/components/ServerFileAsset";

type TrainingDetailHeaderProps = {
  training: TrainingListItem;
};

export async function TrainingDetailHeader({
  training,
}: TrainingDetailHeaderProps) {
  const programCount = training._count.trainingPrograms;

  return (
    <div className="rounded-xl border border-base-300 bg-base-100 shadow-sm overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Visuel */}
        <div className="relative w-full md:w-64 h-40 md:h-auto shrink-0 bg-primary">
          {training.image ? (
            <ServerFileAsset
              fileAsset={training.image}
              render={(url) => (
                <Image
                  src={url}
                  alt={training.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <GraduationCap size={40} className="text-secondary" />
            </div>
          )}
        </div>

        {/* Infos */}
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
            <h1 className="font-heading text-xl font-semibold text-base-content">
              {training.name}
            </h1>

            <div className="flex items-center gap-2 shrink-0">
              <span className="badge badge-soft badge-secondary gap-1.5 font-sans">
                <Layers size={13} />
                {programCount} {programCount > 1 ? "programmes" : "programme"}
              </span>

              <ButtonOpenModal
                modal="updateTraining"
                modalProps={training}
                className="btn btn-sm btn-primary gap-1.5 font-sans"
              >
                <Pencil size={14} />
                Modifier
              </ButtonOpenModal>
            </div>
          </div>

          {training.description && (
            <p className="font-serif text-sm text-base-content/70 leading-relaxed mb-3">
              {training.description}
            </p>
          )}

          {training.objective && (
            <div className="flex items-start gap-2 text-sm text-base-content/70 leading-relaxed">
              <Target size={16} className="text-primary shrink-0 mt-0.5" />
              <p>{training.objective}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
