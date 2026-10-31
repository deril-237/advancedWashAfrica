"use client";

import { FunctionComponent } from "react";
import Input from "@/components/atoms/Input";
import { AlertResponse } from "@/components/atoms/AlertResponse";
import { Controller, useForm } from "react-hook-form";
import { Button, ButtonLoading } from "@/components/atoms/Button";
import { GraduationCapIcon, SaveIcon, Trash2Icon, Layers } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { addProgramInTrainingSchema } from "../schemas";
import { useAddProgramInTraining } from "../hooks";
import { applyActionErrors } from "@/lib/forms/applyActionError";
import { Identifier } from "@/interfaces/entities";
import { SelectProgram } from "@/features/programs";

export type AddTrainingForTrainingFormProps = {
  data: { trainingId: Identifier };
};

export const AddProgramInTrainingForm: FunctionComponent<
  AddTrainingForTrainingFormProps
> = ({ data: { trainingId } }) => {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    formState: { isSubmitting, errors, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(addProgramInTrainingSchema),
  });

  const { mutateAsync: createTraining } = useAddProgramInTraining();
  const submit = handleSubmit(
    async (data) => {
      const result = await createTraining({ ...data, trainingId });

      if (result.serverError) {
        applyActionErrors(result.serverError, setError);
        return;
      }

      reset();
    },
    (error) => {
      console.log(error);
    },
  );

  return (
    <form className="flex flex-col gap-8" onSubmit={submit}>
      <div className="flex gap-2 items-center">
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
          <Layers size={20} />
        </div>
        <h3 className="text-xl md:text-2xl font-heading font-semibold text-base-content">
          Ajouter un parcours
        </h3>
      </div>

      {isSubmitSuccessful && (
        <AlertResponse
          type="success"
          message="Le parcours a été ajoutée avec succès"
        />
      )}

      {errors.root?.message && (
        <AlertResponse type="error" message={errors.root.message} />
      )}

      <div className="flex flex-col gap-6">
        <Controller
          render={({ field, fieldState }) => {
            return (
              <SelectProgram
                onChangeValue={field.onChange}
                value={field.value}
                error={fieldState.error?.message}
              />
            );
          }}
          control={control}
          name="programId"
        />

        <div className="flex items-center justify-around gap-2">
          <Input
            type="number"
            label="Price"
            {...register("price")}
            error={errors.price?.message}
          />

          <p className="mt-8 badge badge-lg bg-base-300 h-11">FCFA</p>
        </div>
      </div>
      <div className="mt-20 flex flex-row gap-4 self-baseline-last">
        <ButtonLoading
          loadingComponent={<span className="loading"></span>}
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary text-white disabled:cursor-not-allowed"
        >
          <SaveIcon size={18} />
          {isSubmitting ? "Traitement..." : "Ajouter"}
        </ButtonLoading>

        <Button
          type="button"
          onClick={() => reset()}
          className="btn btn-soft border border-base-300 text-base-content"
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
    addProgramInTraining: { trainingId: Identifier };
  }
}
