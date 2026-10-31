"use client";

import Input from "@/components/atoms/Input";
import SelectTraining from "@/features/trainings/components/SelectTraining";
import SelectTrainingProgram from "@/features/trainings/components/SelectTrainingProgram";
import { FunctionComponent } from "react";
import { useForm, Controller } from "react-hook-form";
import { createWaveSchema } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateWave } from "../hooks";
import { Button, ButtonLoading } from "@/components/atoms/Button";
import { SaveIcon, Trash2Icon, List } from "lucide-react";
import { AlertResponse } from "@/components/atoms/AlertResponse";
import { applyActionErrors } from "@/lib/forms/applyActionError";
import { identifierSchema } from "@/lib/zodRules";

const createWaveFormSchema = createWaveSchema.extend({
  trainingId: identifierSchema,
});

export const CreateWaveForm: FunctionComponent = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { isSubmitting, isSubmitSuccessful, errors },
    setError,
  } = useForm({
    resolver: zodResolver(createWaveFormSchema),
  });

  const trainingId = watch("trainingId");

  const { mutateAsync: createWave } = useCreateWave();

  const submit = handleSubmit(async (data) => {
    console.log(data);
    const result = await createWave({ ...data });

    if (result.serverError) {
      applyActionErrors(result.serverError, setError);
      return;
    }
    reset();
  });

  return (
    <form className="flex flex-col gap-4" onSubmit={submit}>
      <div className="flex gap-2 items-center">
        <div className="w-8 h-8 md:w-8 md:h-8 flex items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
          <List />
        </div>
        <h3 className="text-xl md:text-2xl first-letter:capitalize font-bold text-gray-900 font-sans">
          {"Creer une vague"}
        </h3>
      </div>
      {isSubmitSuccessful && (
        <AlertResponse
          type="success"
          message={"la vague a été crée avec sucess"}
        />
      )}

      {errors.root?.message && (
        <AlertResponse type="error" message={errors.root.message} />
      )}
      <div className="w-full">
        <Input
          type="date"
          label="Début"
          {...register("startDate")}
          error={errors.startDate?.message}
        />
      </div>
      <div className="w-full">
        <Input
          type="number"
          label="quota"
          {...register("quota")}
          error={errors.quota?.message}
        />
      </div>
      <Controller
        name="trainingId"
        control={control}
        render={({ field: { onChange, value } }) => (
          <SelectTraining
            label="Formation"
            onChangeValue={onChange}
            value={value}
            error={errors.trainingId?.message}
          />
        )}
      />
      <div className="w-full">
        <Controller
          name="trainingProgramId"
          control={control}
          render={({ field: { onChange, value } }) => (
            <SelectTrainingProgram
              trainingId={trainingId}
              label="Parcours"
              placeholder={
                trainingId
                  ? "Choisesz d'abord une formation"
                  : "Choissez d'abord"
              }
              onChangeValue={onChange}
              value={value}
              error={errors.trainingProgramId?.message}
              disabled={trainingId ? false : true}
            />
          )}
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
    createWave: undefined;
  }
}
