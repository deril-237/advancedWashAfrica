"use client";

import { FunctionComponent } from "react";
import Input from "@/components/atoms/Input";
import { AlertResponse } from "@/components/atoms/AlertResponse";
import { useForm } from "react-hook-form";
import { Button, ButtonLoading } from "@/components/atoms/Button";
import { SaveIcon, Trash2Icon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema } from "../schemas";
import { useChangePassword } from "../hooks";
import { applyActionErrors } from "@/lib/forms/applyActionError";
import { useModalStore } from "@/store/useModalStore";
import { toast } from "react-toastify";

export type ChangePasswordProps = {
  data: undefined;
};

export const ChangePasswordForm: FunctionComponent<
  ChangePasswordProps
> = () => {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting, errors, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  const { closeModal } = useModalStore();

  const { mutateAsync: changePassword } = useChangePassword();
  const submit = handleSubmit(async (data) => {
    const result = await changePassword(data);

    if (result.serverError) {
      applyActionErrors(result.serverError, setError);
      return;
    }

    closeModal();

    toast.success("Votre mot de passe à été mise à jour avec success");
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
            type="password"
            label="Mot de passe actuel"
            {...register("currentPassword")}
            error={errors.currentPassword?.message}
          />
        </div>
        <div className="">
          <Input
            type="password"
            label="Nouveau mot de passe"
            {...register("newPassword")}
            error={errors.newPassword?.message}
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
          Enregistrer
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
    changePassword: undefined;
  }
}
