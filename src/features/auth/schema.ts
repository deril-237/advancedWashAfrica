import { emailSchema, passwordSchema } from "@/lib/zodRules";
import zod from "zod";
import {
  ResetPasswordDTO,
  ResetPasswordInput,
  SignInDTO,
  VerifyEmailDTO,
} from "./types";

export const loginSchema = zod.object({
  email: emailSchema,
  password: zod
    .string()
    .min(1, { error: "Le mot de passe est requis" })
    .nonoptional(),
  rememberMe: zod.boolean().optional(),
}) satisfies zod.ZodType<SignInDTO>;

export const verifyEmailSchema = zod.object({
  email: emailSchema,
}) satisfies zod.ZodType<VerifyEmailDTO>;

export const resetPasswordInputSchema = zod
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
  }) satisfies zod.ZodType<ResetPasswordInput>;

export const resetPasswordSchema = zod.object({
  newPassword: passwordSchema,
  token: zod.string().min(1, { error: "Le token est requis" }),
}) satisfies zod.ZodType<ResetPasswordDTO>;

export const changeEmailSchema = zod.object({
  email: emailSchema,
}) satisfies zod.ZodType<VerifyEmailDTO>;
