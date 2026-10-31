"use client";

import { FunctionComponent } from "react";
import Input from "@/components/atoms/Input";
import { AlertResponse } from "@/components/atoms/AlertResponse";
import { Controller, useForm } from "react-hook-form";
import { Button, ButtonLoading } from "@/components/atoms/Button";
import { GraduationCapIcon, SaveIcon, Trash2Icon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTrainingInputSchema } from "../schemas";
import { useCreateTraining } from "../hooks";
import { applyActionErrors } from "@/lib/forms/applyActionError";
import TextArea from "@/components/atoms/TextArea";
import { InputFile } from "@/components/atoms/InputFile";

export type AddTrainingFormProps = {
  data: undefined;
};

export const AddTrainingForm: FunctionComponent<AddTrainingFormProps> = () => {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    formState: { isSubmitting, errors, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(createTrainingInputSchema),
  });

  const { mutateAsync: createTraining } = useCreateTraining();

  const submit = handleSubmit(
    async (data) => {
      const result = await createTraining(data);

      if (result.serverError) {
        applyActionErrors(result.serverError, setError);
        return;
      }

      if (!result.data) {
        applyActionErrors(
          { global: "Erreur pend", fieldErrors: {}, code: "CONFLICT" },
          setError,
        );
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
          <GraduationCapIcon size={20} />
        </div>
        <h3 className="text-xl md:text-2xl font-heading font-semibold text-base-content">
          Ajouter une formation
        </h3>
      </div>

      {isSubmitSuccessful && (
        <AlertResponse
          type="success"
          message="La formation a été ajoutée avec succès"
        />
      )}

      {errors.root?.message && (
        <AlertResponse type="error" message={errors.root.message} />
      )}

      <div className="flex flex-col gap-4">
        <Controller
          control={control}
          name="image"
          render={({
            field: { onChange, name, ref },
            fieldState: { error },
          }) => (
            <InputFile
              ref={ref}
              name={name}
              label="Photo"
              accept="image/jpeg,image/png"
              showPreview={true}
              multiple={false}
              onChange={(files) => onChange(files?.[0] ?? null)}
              error={error?.message}
            />
          )}
        />

        <Input
          type="text"
          label="Nom"
          {...register("name")}
          error={errors.name?.message}
        />

        <TextArea
          label="Objectif"
          {...register("objective")}
          error={errors.objective?.message}
        />

        <TextArea
          label="Description"
          {...register("description")}
          error={errors.description?.message}
        />
      </div>

      <div className="mt-5 flex flex-row gap-4 self-baseline-last">
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
    addTraining: undefined;
  }
}
