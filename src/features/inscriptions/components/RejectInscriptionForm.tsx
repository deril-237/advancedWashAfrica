"use client";

import { Identifier } from "@/interfaces/entities";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { rejectInscriptionSchema } from "../schemas";
import { Button, ButtonLoading } from "@/components/atoms/Button";
import { UserRoundPenIcon, SaveIcon, Trash2Icon } from "lucide-react";
import { AlertResponse } from "@/components/atoms/AlertResponse";
import { applyActionErrors } from "@/lib/forms/applyActionError";
import { rejectInscriptionAction } from "../actions";
import TextArea from "@/components/atoms/TextArea";
import { toast } from "react-toastify";

type RejectInscriptionProps = {
  data: {
    inscriptionId: Identifier;
  };
};

export function RejectInscriptionForm({
  data: { inscriptionId },
}: RejectInscriptionProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(rejectInscriptionSchema),
  });

  const submit = handleSubmit(async (formData) => {
    const result = await rejectInscriptionAction(inscriptionId, formData);

    if (result.serverError) {
      applyActionErrors(result.serverError, setError);
      return;
    }

    toast.success(
      "Inscription refusé avec success. un email a été envoyé au candidat avec la raison du rejet",
    );
  });

  return (
    <form className="flex flex-col gap-4" onSubmit={submit}>
      <div className="flex gap-2 items-center">
        <div
          className="p-2
            flex items-center justify-center 
            rounded-xl bg-primary/10 
            text-primary shrink-0
          "
        >
          <UserRoundPenIcon className="md:size-8" />
        </div>

        <h3
          className="
            text-xl md:text-2xl 
            first-letter:capitalize 
            font-bold text-gray-900 
            font-sans
          "
        >
          Reason du refus
        </h3>
      </div>

      {errors.root?.message && (
        <AlertResponse type="error" message={errors.root.message} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextArea
          label="Reason"
          placeholder={`Saisez la raison du rejet`}
          {...register("reasonRejected")}
          error={errors.reasonRejected?.message}
        />
      </div>

      <div className="mt-5 flex flex-row gap-4 self-baseline-last">
        <ButtonLoading
          loadingComponent={<span className="loading"></span>}
          type="submit"
          disabled={isSubmitting}
          className="btn btn-success text-white disabled:cursor-not-allowed"
        >
          <SaveIcon size={18} />
          Enregistrer
        </ButtonLoading>

        <Button
          type="button"
          onClick={() => reset()}
          className="btn btn-error text-white"
        >
          <Trash2Icon size={18} />
          Annuler
        </Button>
      </div>
    </form>
  );
}

declare module "@/store/useModalStore" {
  interface ModalRegistry {
    rejectInscription: {
      inscriptionId: Identifier;
    };
  }
}
