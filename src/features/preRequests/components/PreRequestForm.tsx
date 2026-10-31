"use client";

import Input from "@/components/atoms/Input";
import { FunctionComponent } from "react";
import { useForm } from "react-hook-form";
import { createPreRequestSchema } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMutationCreatePreRequest,
  useMutationUpdatePreRequest,
} from "../hooks";
import { Button, ButtonLoading } from "@/components/atoms/Button";
import { SaveIcon, Trash2Icon, ClipboardCheckIcon } from "lucide-react";
import { AlertResponse } from "@/components/atoms/AlertResponse";
import { applyActionErrors } from "@/lib/forms/applyActionError";
import { PreRequest } from "../types";
import { Identifier } from "@/interfaces/entities";

export type FormPreRequestProps =
  | { preRequest: PreRequest; type: "update"; trainingProgramId: undefined }
  | { type: "add"; trainingProgramId: Identifier; preRequest?: undefined };

export const PreRequestForm: FunctionComponent<{
  data: FormPreRequestProps;
}> = ({ data: { preRequest, trainingProgramId, type } }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isSubmitSuccessful, errors },
    setError,
  } = useForm({
    defaultValues: preRequest,
    resolver: zodResolver(
      createPreRequestSchema.pick({
        label: true,
        order: true,
      }),
    ),
  });

  const { mutateAsync: createPreRequest } = useMutationCreatePreRequest();
  const { mutateAsync: updatePreRequest } = useMutationUpdatePreRequest();


  const submit = handleSubmit(async (formData) => {
    const result = type === "add" ? await createPreRequest({ ...formData, trainingProgramId })
      : await updatePreRequest({ ...formData, preRequestId: preRequest.id });

    if (result.serverError) {
      applyActionErrors(result.serverError, setError);
      return;
    }
    if (result.data) {
      reset(type === "add" ? {} : result.data);
    }
  });

  return (
    <form className="flex flex-col gap-4" onSubmit={submit}>
      <div className="flex gap-2 items-center">
        <div className="w-8 h-8 md:w-8 md:h-8 gap-3 flex items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
          <ClipboardCheckIcon />
        </div>
        <h3 className="text-xl md:text-2xl first-letter:capitalize font-bold text-gray-900 font-sans">
          {type === "add"
            ? "Ajouter un prérequis"
            : "Mettre à jour le prérequis"}
        </h3>
      </div>
      {isSubmitSuccessful && (
        <AlertResponse
          type="success"
          message={
            type === "add"
              ? "Le prérequis a été créé avec succès"
              : "Le prérequis a été modifié avec succès"
          }
        />
      )}

      {errors.root?.message && (
        <AlertResponse type="error" message={errors.root.message} />
      )}
      <div className="w-full">
        <Input
          type="text"
          label="Prérequis"
          {...register("label")}
          error={errors.label?.message}
        />
      </div>
      <div className="w-full">
        <Input
          type="number"
          label="Ordre d'affichage"
          {...register("order")}
          error={errors.order?.message}
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
          {isSubmitting ? "Traitement..." : "Enregistrer"}
        </ButtonLoading>
        <Button
          type="button"
          onClick={() => {
            reset();
          }}
          className="btn btn-error text-white"
        >
          <Trash2Icon size={18} />
          Annuler
        </Button>
      </div>
    </form>
  );
};

declare module "@/store/useModalStore" {
  interface ModalRegistry {
    formPreRequest: FormPreRequestProps;
  }
}
