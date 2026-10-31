"use client";

import Input from "@/components/atoms/Input";
import { FunctionComponent } from "react";
import { useForm } from "react-hook-form";
import { createModuleSchema } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutationCreateModule, useMutationUpdateModule } from "../hooks";
import zod from "zod";
import { Button, ButtonLoading } from "@/components/atoms/Button";
import { SaveIcon, Trash2Icon, LayersIcon } from "lucide-react";
import { AlertResponse } from "@/components/atoms/AlertResponse";
import { applyActionErrors } from "@/lib/forms/applyActionError";
import { Module } from "../types";
import { Identifier } from "@/interfaces/entities";
import TextArea from "@/components/atoms/TextArea";

type FormModuleProps =
  | { module: Module; type: "update"; trainingProgramId: undefined }
  | { type: "add"; trainingProgramId: Identifier; module?: undefined };

export const ModuleForm: FunctionComponent<{ data: FormModuleProps }> = ({
  data: { module, trainingProgramId, type },
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isSubmitSuccessful, errors },
    setError,
  } = useForm({
    defaultValues: module,
    resolver: zodResolver(
      createModuleSchema.pick({
        name: true,
        description: true,
        position: true,
      }),
    ),
  });

  const { mutateAsync: createModule } = useMutationCreateModule();
  const { mutateAsync: updateModule } = useMutationUpdateModule();

  let result: any;
  const submit = handleSubmit(async (data) => {
    if (type === "add") {
      result = await createModule({ ...data, trainingProgramId });
    } else {
      result = await updateModule({ ...data, moduleId: module.id });
    }

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
          <LayersIcon />
        </div>
        <h3 className="text-xl md:text-2xl first-letter:capitalize font-bold text-gray-900 font-sans">
          {type === "add" ? "Ajouter un module" : "Mettre à jour le module"}
        </h3>
      </div>
      {isSubmitSuccessful && (
        <AlertResponse
          type="success"
          message={
            type === "add"
              ? "la vague a été crée avec sucess"
              : "Le module a été modifié avec success"
          }
        />
      )}

      {errors.root?.message && (
        <AlertResponse type="error" message={errors.root.message} />
      )}
      <div className="w-full">
        <Input
          type="text"
          label="name"
          {...register("name")}
          error={errors.name?.message}
        />
      </div>
      <div className="w-full">
        <Input
          type="number"
          label="numéro"
          {...register("position")}
          error={errors.position?.message}
        />
      </div>
      <div className="w-full">
        <TextArea
          label="Descritption"
          {...register("description")}
          error={errors.description?.message}
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
    formModule: FormModuleProps;
  }
}
