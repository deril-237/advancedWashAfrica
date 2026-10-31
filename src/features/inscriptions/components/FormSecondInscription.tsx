"use client";

import { SelectTraining, SelectTrainingProgram } from "@/features/trainings";
import { Identifier } from "@/interfaces/entities";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { secondInscriptionSchema } from "../schemas";
import { identifierSchema } from "@/lib/zodRules";
import { useSecondInscription } from "../hooks";
import { Button, ButtonLoading } from "@/components/atoms/Button";
import { GraduationCapIcon, SaveIcon, Trash2Icon } from "lucide-react";
import { AlertResponse } from "@/components/atoms/AlertResponse";
import { applyActionErrors } from "@/lib/forms/applyActionError";
import { RadioModalityOptionGroup } from "./RadioModalityOptionGroup";

const formSchema = secondInscriptionSchema.extend({
  trainingId: identifierSchema,
});

type FormSecondInscriptionProps = {
  data: {
    studentId: Identifier;
  };
};

export function FormSecondInscription({ data }: FormSecondInscriptionProps) {
  const {
    control,
    watch,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const trainingId = watch("trainingId");

  const { mutateAsync: secondInscription } = useSecondInscription(
    data.studentId,
  );

  const submit = handleSubmit(async (formData) => {
    const result = await secondInscription(formData);

    if (result.serverError) {
      applyActionErrors(result.serverError, setError);
      return;
    }

    reset();
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
          <GraduationCapIcon className="md:size-8" />
        </div>

        <h3
          className="
            text-xl md:text-2xl 
            first-letter:capitalize 
            font-bold text-gray-900 
            font-sans
          "
        >
          Nouvelle inscription
        </h3>
      </div>

      {isSubmitSuccessful && (
        <AlertResponse
          type="success"
          message="Inscription effectuée avec succès"
        />
      )}

      {errors.root?.message && (
        <AlertResponse type="error" message={errors.root.message} />
      )}

      <Controller
        name="trainingId"
        control={control}
        render={({ field: { onChange, value } }) => (
          <SelectTraining
            label="Formation"
            value={value}
            onChangeValue={onChange}
            error={errors.trainingId?.message}
            required
          />
        )}
      />

      <Controller
        name="trainingProgramId"
        control={control}
        render={({ field: { onChange, value } }) => (
          <SelectTrainingProgram
            trainingId={trainingId}
            label="Parcours"
            placeholder={
              trainingId
                ? "Choisissez un parcours"
                : "Choisissez d'abord une formation"
            }
            value={value}
            onChangeValue={onChange}
            error={errors.trainingProgramId?.message}
            disabled={!trainingId}
            required={true}
          />
        )}
      />

      <Controller
        control={control}
        name="modality"
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <RadioModalityOptionGroup
            label="Type de suivie"
            value={value}
            onChange={onChange}
            error={error?.message}
            required={true}
          />
        )}
      />

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
    secondInscription: { studentId: Identifier };
  }
}
