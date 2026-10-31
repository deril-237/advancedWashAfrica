import { InscriptionStatus, ModalityOption } from "./types";

export const MODALITY_LABELS: Record<ModalityOption, string> = {
  ON_LINE: "En ligne",
  OFF_LINE: "Présentiel",
};

export const STATUS_CONFIG: Record<
  InscriptionStatus,
  { label: string; badgeClass: string }
> = {
  SUBMITTED: { label: "Soumise", badgeClass: "badge-warning" },
  ACCEPTED: { label: "Acceptée", badgeClass: "badge-success" },
  REJECTED: { label: "Rejetée", badgeClass: "badge-error" },
};
