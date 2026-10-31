"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateTrainingProgramSchema } from "../schemas";
import Input from "@/components/atoms/Input";
import { Button, ButtonLoading } from "@/components/atoms/Button";
import { SaveIcon, Trash2Icon, CircleDollarSign } from "lucide-react";
import { TrainingProgramItem } from "../types";
import { updateTrainingProgramAction } from "../actions";
import { applyActionErrors } from "@/lib/forms/applyActionError";

export type TrainingProgramFormProps = TrainingProgramItem;

export function UpdateTrainingProgramForm({
  data: trainingProgram,
}: {
  data: TrainingProgramFormProps;
}) {
  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting },
    setError,
  } = useForm({
    defaultValues: { price: trainingProgram.price },
    resolver: zodResolver(updateTrainingProgramSchema),
  });

  const submit = handleSubmit(async (data) => {
    const result = await updateTrainingProgramAction(trainingProgram.id, data);

    if (result.serverError) {
      applyActionErrors(result.serverError, setError);
    }
  });

  return (
    <form action="" onSubmit={submit} className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="size-10 flex items-center justify-center rounded-md bg-primary/10">
          <CircleDollarSign
            size={20}
            className="text-primary shrink-0 mt-0.5"
          />
        </div>
        <p className="text-xl">Update price</p>
      </div>
      <Input {...register("price")} />
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
}

declare module "@/store/useModalStore" {
  interface ModalRegistry {
    updateTrainingProgram: TrainingProgramFormProps;
  }
}
