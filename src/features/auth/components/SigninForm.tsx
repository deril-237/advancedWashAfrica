"use client";

import Link from "next/link";
import { LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { AlertResponse } from "@/components/atoms/AlertResponse";

import { loginSchema } from "../schema";
import { sigInAction } from "../actions";
import { applyActionErrors } from "@/lib/forms/applyActionError";

type LoginFormData = {
  email: string;
  password: string;
};

export function SigninForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const submit = handleSubmit(async (data) => {
    const result = await sigInAction(data);
    result;
    if (result.serverError) {
      applyActionErrors(result.serverError, setError);
    }
  });

  return (
    <form onSubmit={submit} className="space-y-5">
      {errors.root?.message && (
        <AlertResponse type="error" message={errors.root.message} />
      )}

      <Input
        label="Adresse email"
        type="email"
        placeholder="nom@kesmonduniversity.org"
        autoComplete="email"
        {...register("email")}
        error={errors.email?.message}
      />

      <div className="space-y-2">
        <Input
          label="Mot de passe"
          type="password"
          placeholder="Votre mot de passe"
          autoComplete="current-password"
          {...register("password")}
          error={errors.password?.message}
        />

        <div className="flex justify-end">
          <Link
            href="/auth/for-get-password"
            className="text-sm text-primary transition-colors hover:text-primary/80 hover:underline"
          >
            Mot de passe oublié ?
          </Link>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary w-full"
      >
        {isSubmitting ? (
          <>
            <span className="loading loading-spinner loading-sm" />
            Connexion...
          </>
        ) : (
          <>
            <LogIn className="size-5" />
            Se connecter
          </>
        )}
      </Button>
    </form>
  );
}
