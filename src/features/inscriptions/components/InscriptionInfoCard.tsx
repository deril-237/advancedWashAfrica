import { CalendarClock, Laptop2 } from "lucide-react";
import { STATUS_CONFIG, MODALITY_LABELS } from "../utils";
import { InscriptionActions } from "./InscriptionActions";
import type { InscriptionListItem } from "../types";

type InscriptionInfoCardProps = {
  inscription: Pick<
    InscriptionListItem,
    "id" | "status" | "modality" | "createdAt" | "wave"
  > & { reasonRejected: string | null };
};

export function InscriptionInfoCard({ inscription }: InscriptionInfoCardProps) {
  const status = STATUS_CONFIG[inscription.status];
  const { training, program } = inscription.wave.trainingProgram;

  return (
    <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
        <div>
          <h3 className="font-heading text-lg font-semibold text-primary">
            {training.name}
          </h3>
          <p className="text-sm text-base-content/50 mt-1">
            {program.duration} mois de formation
          </p>
        </div>
        <span className={`badge badge-lg badge-soft ${status.badgeClass}`}>
          {status.label}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-3 rounded-xl border border-base-300 px-4 py-3">
          <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/8 text-primary ring-1 ring-primary/10">
            <Laptop2 size={16} />
          </span>
          <div>
            <p className="text-xs text-base-content/50">Modalité</p>
            <p className="text-sm font-medium">
              {MODALITY_LABELS[inscription.modality]}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-base-300 px-4 py-3">
          <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/8 text-primary ring-1 ring-primary/10">
            <CalendarClock size={16} />
          </span>
          <div>
            <p className="text-xs text-base-content/50">Date de soumission</p>
            <p className="text-sm font-medium">
              {new Date(inscription.createdAt).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {inscription.status === "REJECTED" && inscription.reasonRejected && (
        <div className="alert alert-error alert-soft mb-6 text-sm">
          <span>
            <strong>Motif du rejet : </strong>
            {inscription.reasonRejected}
          </span>
        </div>
      )}

      {inscription.status === "ACCEPTED" && (
        <div className="alert alert-success alert-soft mb-2 text-sm">
          <span>Ce dossier a été validé.</span>
        </div>
      )}

      {inscription.status === "SUBMITTED" && (
        <InscriptionActions inscriptionId={inscription.id} />
      )}
    </div>
  );
}
