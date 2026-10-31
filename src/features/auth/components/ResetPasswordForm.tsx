"use client";

import Input from "@/components/atoms/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { resetPasswordInputSchema } from "../schema";
import { ButtonLoading, Button } from "@/components/atoms/Button";
import { LogIn } from "lucide-react";
import { resetPasswordAction } from "../actions";
import { applyActionErrors } from "@/lib/forms/applyActionError";

type ResetPasswordFormProps = {
  token: string;
};
export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(resetPasswordInputSchema),
  });

  const submit = handleSubmit(async (data) => {
    const result = await resetPasswordAction({
      newPassword: data.password,
      token,
    });

    if (result.serverError) {
      applyActionErrors(result.serverError, setError);
    }
  });

  return (
    <form onSubmit={submit} className="">
      <div className="flex flex-col gap-4 w-96">
        <Input
          label="Nouveau Password"
          placeholder="••••••••"
          type="password"
          {...register("password")}
          error={errors.password?.message}
        />
        <Input
          label="Confirmer le Nouveau Password"
          placeholder="••••••••"
          type="password"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />
        <Button className="btn btn-primary btn-md" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="loading"> </span>
          ) : (
            <LogIn className="size-6" />
          )}{" "}
          Renouveller le mot de passe
        </Button>
      </div>
    </form>
  );
}
