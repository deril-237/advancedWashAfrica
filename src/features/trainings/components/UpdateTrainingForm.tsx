"use client";

import { FunctionComponent } from "react";
import Input from "@/components/atoms/Input";
import { AlertResponse } from "@/components/atoms/AlertResponse";
import { useForm } from "react-hook-form";
import { Button, ButtonLoading } from "@/components/atoms/Button";
import { SaveIcon, Trash2Icon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateTrainingInputSchema } from "../schemas";
import { useUpdateTraining } from "../hooks";
import { TrainingListItem } from "../types";
import { applyActionErrors } from "@/lib/forms/applyActionError";
import TextArea from "@/components/atoms/TextArea";
import { InputFile } from "@/components/atoms/InputFile";

export type UpdateTrainingFormProps = {
  data: TrainingListItem;
};

export const UpdateTrainingForm: FunctionComponent<UpdateTrainingFormProps> = ({
  data: training,
}) => {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    resetDefaultValues,
    formState: { isSubmitting, errors, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(updateTrainingInputSchema),
    defaultValues: {
      name: training.name,
      description: training.description,
      objective: training.objective,
    },
  });

  const { mutateAsync: updateTraining } = useUpdateTraining();

  const submit = handleSubmit(async (data) => {
    const result = await updateTraining({ ...data, trainingId: training.id });

    if (result.serverError) {
      applyActionErrors(result.serverError, setError);
      return;
    }

    resetDefaultValues({ ...result.data }, {});
  });

  return (
    <form className="flex flex-col gap-4" onSubmit={submit}>
      {isSubmitSuccessful && (
        <AlertResponse
          type="success"
          message={"La vague a été modifié avec success"}
        />
      )}

      {errors.root?.message && (
        <AlertResponse type="error" message={errors.root.message} />
      )}
      <div className="flex flex-col gap-4">
        <div className="">
          <InputFile
            defaultPreview={
              training.image
                ? { kind: "image", src: training.image.url }
                : undefined
            }
          />
        </div>

        <div className="">
          <Input
            type="text"
            label="Name"
            {...register("name")}
            error={errors.name?.message}
          />
        </div>
        <div className="">
          <TextArea
            label="Objectif"
            {...register("objective")}
            error={errors.objective?.message}
          />
        </div>
        <div className="">
          <TextArea
            label="Description"
            {...register("description")}
            error={errors.objective?.message}
          />
        </div>
      </div>
      <div className="mt-5 flex flex-row gap-4 self-baseline-last">
        <ButtonLoading
          loadingComponent={<span className="loading"></span>}
          type="submit"
          disabled={isSubmitting}
          className="btn btn-warning text-white disabled:cursor-not-allowed"
        >
          <SaveIcon size={18} />
          {isSubmitting ? "Traitement..." : "Modifier"}
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
    updateTraining: TrainingListItem;
  }
}
