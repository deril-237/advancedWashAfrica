"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "react-toastify";
import { acceptInscriptionAction } from "../actions";
import { ButtonOpenModal } from "@/components/molecules";
import type { Identifier } from "@/interfaces/entities";

export function InscriptionActions({
  inscriptionId,
}: {
  inscriptionId: Identifier;
}) {
  const [confirmingAccept, setConfirmingAccept] = useState(false);

  const { execute: accept, isExecuting: isAccepting } = useAction(
    acceptInscriptionAction,
    {
      onSuccess: () => toast.success("Dossier validé avec succès"),
      onError: ({ error }) =>
        toast.error(error.serverError?.global ?? "Une erreur est survenue"),
      onSettled: () => setConfirmingAccept(false),
    },
  );

  return (
    <div className="pt-4 border-t border-base-300">
      <p className="text-xs text-base-content/50 mb-3">
        Ce dossier est en attente de traitement.
      </p>

      {confirmingAccept ? (
        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-sm font-medium">Confirmer la validation ?</p>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={isAccepting}
            onClick={() => accept({ inscriptionId })}
          >
            {isAccepting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              "Oui, valider"
            )}
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            disabled={isAccepting}
            onClick={() => setConfirmingAccept(false)}
          >
            Annuler
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            className="btn btn-primary btn-soft flex-1 sm:flex-none"
            onClick={() => setConfirmingAccept(true)}
          >
            <CheckCircle2 size={16} />
            Valider le dossier
          </button>

          <ButtonOpenModal
            modal="rejectInscription"
            modalProps={{ inscriptionId }}
            className="btn btn-error btn-soft not-last: hover:text-white flex-1 sm:flex-none"
          >
            <XCircle size={16} />
            Rejeter le dossier
          </ButtonOpenModal>
        </div>
      )}
    </div>
  );
}
