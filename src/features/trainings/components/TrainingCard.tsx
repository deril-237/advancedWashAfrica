import Image from "next/image";
import Link from "next/link";
import { GraduationCap, Layers, ArrowUpRight, Target } from "lucide-react";
import { TrainingListItem } from "../types";
import { getUrl } from "@/lib/StorageService/cloudinary/cloudinary-signer";

type TrainingCardProps = {
  training: TrainingListItem;
};

export function TrainingCard({ training }: TrainingCardProps) {
  const programCount = training._count.trainingPrograms;

  return (
    <Link
      href={`/admin/trainings/${training.id}`}
      className="group flex flex-col rounded-xl border border-base-300 bg-base-100 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/30 hover:scale-105"
    >
      <div className="relative w-full h-40 shrink-0 bg-primary">
        {training.image ? (
          <Image
            src={training.image.url}
            alt={training.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <GraduationCap size={36} className="text-secondary" />
          </div>
        )}

        <span className="absolute top-3 right-3 badge badge-soft badge-secondary gap-1.5 font-sans backdrop-blur-sm">
          <Layers size={12} />
          {programCount} {programCount > 1 ? "programmes" : "programme"}
        </span>
      </div>

      <div className="flex-1 flex flex-col p-5 gap-2">
        <h3 className="font-heading text-lg font-semibold text-base-content leading-snug line-clamp-2">
          {training.name}
        </h3>
        {training.objective && (
          <div className="flex items-start gap-2 text-sm text-base-content/70 leading-relaxed">
            <Target size={16} className="text-primary shrink-0 mt-0.5" />
            <p>{training.objective}</p>
          </div>
        )}
        {training.description && (
          <p className="font-serif text-sm text-base-content/70 leading-relaxed line-clamp-2">
            {training.description}
          </p>
        )}

        <div className="mt-auto pt-3 flex items-center justify-between font-sans text-sm">
          <span className="text-primary font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
            Voir la formation
            <ArrowUpRight size={15} />
          </span>
        </div>
      </div>
    </Link>
  );
}
