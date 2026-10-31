"use client";

import { Identifier } from "@/interfaces/entities";
import { UpdateStudentInformationDTO } from "@/features/students/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateStudentInformationSchema } from "../schemas";
import { Button, ButtonLoading } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { UserRoundPenIcon, SaveIcon, Trash2Icon } from "lucide-react";
import { AlertResponse } from "@/components/atoms/AlertResponse";
import { applyActionErrors } from "@/lib/forms/applyActionError";
import { updateStudentInfoAction } from "../actions";

type FormUpdateStudentInfoProps = {
  data: {
    studentId: Identifier;
    defaultValues?: UpdateStudentInformationDTO;
  };
};

export function FormUpdateStudentInfo({ data }: FormUpdateStudentInfoProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(updateStudentInformationSchema),
    defaultValues: data.defaultValues,
  });

  // const { mutateAsync: updateStudentInfo } = useUpdateStudentInfoMutation(
  //   data.studentId,
  // );

  const submit = handleSubmit(async (formData) => {
    const result = await updateStudentInfoAction(data.studentId, formData);

    if (result.serverError) {
      applyActionErrors(result.serverError, setError);
      return;
    }
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
          <UserRoundPenIcon className="md:size-8" />
        </div>

        <h3
          className="
            text-xl md:text-2xl 
            first-letter:capitalize 
            font-bold text-gray-900 
            font-sans
          "
        >
          Modifier les informations
        </h3>
      </div>

      {isSubmitSuccessful && (
        <AlertResponse
          type="success"
          message="Informations mises à jour avec succès"
        />
      )}

      {errors.root?.message && (
        <AlertResponse type="error" message={errors.root.message} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Nom" {...register("name")} error={errors.name?.message} />

        <Input
          label="Prénom"
          {...register("secondName")}
          error={errors.secondName?.message}
        />

        <Input
          type="date"
          label="Date de naissance"
          {...register("birthDate")}
          defaultValue={data.defaultValues?.birthDate?.toDateString()}
          error={errors.birthDate?.message}
        />

        <Input
          label="Lieu de naissance"
          {...register("birthPlace")}
          error={errors.birthPlace?.message}
        />

        <Input
          label="N° CNI / Passeport"
          {...register("numCNIPassport")}
          error={errors.numCNIPassport?.message}
        />

        <Input
          type="email"
          label="Email"
          {...register("email")}
          error={errors.email?.message}
        />

        <Input
          label="Téléphone"
          {...register("phone")}
          error={errors.phone?.message}
        />

        <Input
          label="Résidence"
          {...register("residence")}
          error={errors.residence?.message}
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
    updateStudentInfo: {
      studentId: Identifier;
      defaultValues?: UpdateStudentInformationDTO;
    };
  }
}
