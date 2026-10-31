// features/trainings/components/TrainingProgramCard.tsx
import Link from "next/link";
import { Clock, Wallet, ArrowUpRight } from "lucide-react";

type TrainingProgramCardProps = {
  trainingProgram: {
    id: string | number;
    price: number;
    program: {
      id: string | number;
      duration: number;
    };
  };
};

const priceFormatter = new Intl.NumberFormat("fr-FR");

export function TrainingProgramCard({
  trainingProgram,
}: TrainingProgramCardProps) {
  return (
    <div className="flex flex-col rounded-xl border border-base-300 bg-base-100 shadow-sm p-5 gap-4 font-sans">
      <div className="flex items-center justify-between">
        <span className="badge badge-soft badge-secondary gap-1.5">
          <Clock size={13} />
          {trainingProgram.program.duration} mois
        </span>
      </div>

      <div className="flex items-center gap-2 text-base-content">
        <Wallet size={16} className="text-primary" />
        <p className="text-lg font-semibold">
          {priceFormatter.format(trainingProgram.price)} FCFA
        </p>
      </div>

      <Link
        href={`/admin/training-programs/${trainingProgram.id}`}
        className="mt-auto inline-flex items-center gap-1 text-sm text-primary font-medium hover:gap-2 transition-all duration-200"
      >
        Voir plus
        <ArrowUpRight size={15} />
      </Link>
    </div>
  );
}
