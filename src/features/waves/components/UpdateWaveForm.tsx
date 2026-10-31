"use client";

import { FunctionComponent } from "react";
import Input from "@/components/atoms/Input";
import { AlertResponse } from "@/components/atoms/AlertResponse";
import { useForm } from "react-hook-form";
import { Button, ButtonLoading } from "@/components/atoms/Button";
import { SaveIcon, Trash2Icon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateWaveSchema } from "../schemas";
import { useUpdateWave } from "../hooks";
import { Wave } from "../types";
import { applyActionErrors } from "@/lib/forms/applyActionError";

export type UpdateWaveFormProps = {
  data: Wave;
};

export const UpdateWaveForm: FunctionComponent<UpdateWaveFormProps> = ({
  data: wave,
}) => {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting, errors, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(updateWaveSchema),
    defaultValues: {
      ...wave,
      startDate: wave.startDate.toDateString(),
    },
  });

  const { mutateAsync: updateWave } = useUpdateWave(wave.id);

  const submit = handleSubmit(async (data) => {
    const result = await updateWave(data);

    if (result.serverError) {
      applyActionErrors(result.serverError, setError);
      return;
    }

    // resetDefaultValues({ ...result.data }, {});
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
          <Input
            type="date"
            label="Debut"
            {...register("startDate")}
            defaultValue={wave.startDate.toLocaleString()}
            error={errors.startDate?.message}
          />
        </div>
        <div className="">
          <Input
            type="number"
            label="quota"
            {...register("quota")}
            error={errors.quota?.message}
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
    updateWave: Wave;
  }
}
