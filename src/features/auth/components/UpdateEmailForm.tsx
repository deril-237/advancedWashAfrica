"use client";

import Input from "@/components/atoms/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { verifyEmailSchema } from "../schema";
import { ButtonLoading } from "@/components/atoms/Button";
import { LogIn } from "lucide-react";
import { verifyEmailAction } from "../actions";
import { applyActionErrors } from "@/lib/forms/applyActionError";
import { AlertResponse } from "@/components/atoms/AlertResponse";

export function VerifyEmailForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(verifyEmailSchema),
  });

  const submit = handleSubmit(async (data) => {
    const result = await verifyEmailAction(data);

    if (result.serverError) {
      applyActionErrors(result.serverError, setError);
    }
  });

  return (
    <form onSubmit={submit} className="">
      <div className="flex flex-col gap-4 w-96">
        {errors.root?.message && (
          <AlertResponse type="error" message={errors.root.message} />
        )}
        <Input
          label="Email"
          placeholder="paul@kesmondsuniversity.org"
          {...register("email")}
          error={errors.email?.message}
        />
        <ButtonLoading
          className="btn btn-primary btn-md"
          loadingComponent={<span className="loading"></span>}
        >
          {isSubmitting ? (
            <span className="loading"></span>
          ) : (
            <LogIn className="size-6" />
          )}
          Changer
        </ButtonLoading>
      </div>
    </form>
  );
}
