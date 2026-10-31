"use client";

import Input from "@/components/atoms/Input";
import { FunctionComponent } from "react";
import { useForm } from "react-hook-form";
import { createCarrerOpportunitySchema } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMutationCreateCarrerOpportunity,
  useMutationUpdateCarrerOpportunity,
} from "../hooks";
import { Button, ButtonLoading } from "@/components/atoms/Button";
import { SaveIcon, Trash2Icon, BriefcaseIcon } from "lucide-react";
import { AlertResponse } from "@/components/atoms/AlertResponse";
import { applyActionErrors } from "@/lib/forms/applyActionError";
import { CarrerOpportunity } from "@/lib/generated/prisma/client";
import { Identifier } from "@/interfaces/entities";

export type FormCarrerOpportunityProps =
  | { carrerOpportunity: CarrerOpportunity; type: "update"; trainingProgramId: undefined }
  | { type: "add"; trainingProgramId: Identifier; carrerOpportunity?: undefined };

export const CarrerOpportunityForm: FunctionComponent<{
  data: FormCarrerOpportunityProps;
}> = ({ data: { carrerOpportunity, trainingProgramId, type } }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isSubmitSuccessful, errors },
    setError,
  } = useForm({
    defaultValues: carrerOpportunity,
    resolver: zodResolver(
      createCarrerOpportunitySchema.pick({
        label: true,
      }),
    ),
  });

  const { mutateAsync: createCarrerOpportunity } = useMutationCreateCarrerOpportunity();
  const { mutateAsync: updateCarrerOpportunity } = useMutationUpdateCarrerOpportunity();

  const submit = handleSubmit(async (formData) => {
    const result = type === "add" ? await createCarrerOpportunity({ ...formData, trainingProgramId }) : await updateCarrerOpportunity({ ...formData, carrerOpportunityId: carrerOpportunity.id })

    if (result.serverError) {
      applyActionErrors(result.serverError, setError);
      return;
    }

    reset(type === "add" ? {} : (result.data ?? {}));
  });

  return (
    <form className="flex flex-col gap-4" onSubmit={submit}>
      <div className="flex gap-2 items-center">
        <div className="w-8 h-8 md:w-8 md:h-8 gap-3 flex items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
          <BriefcaseIcon />
        </div>
        <h3 className="text-xl md:text-2xl first-letter:capitalize font-bold text-gray-900 font-sans">
          {type === "add"
            ? "Ajouter une opportunité"
            : "Mettre à jour l'opportunité"}
        </h3>
      </div>
      {isSubmitSuccessful && (
        <AlertResponse
          type="success"
          message={
            type === "add"
              ? "L'opportunité a été créée avec succès"
              : "L'opportunité a été modifiée avec succès"
          }
        />
      )}

      {errors.root?.message && (
        <AlertResponse type="error" message={errors.root.message} />
      )}
      <div className="w-full">
        <Input
          type="text"
          label="Nom de l'opportunité de carrière"
          {...register("label")}
          error={errors.label?.message}
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
    formCarrerOpportunity: FormCarrerOpportunityProps;
  }
}
