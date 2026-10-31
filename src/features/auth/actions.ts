"use server";

import {
  logout,
  resetPassword,
  signIn,
  verifyEmailResetPassword,
} from "./services";
import { redirect } from "next/navigation";
import { loginSchema, resetPasswordSchema, verifyEmailSchema } from "./schema";
import { headers } from "next/headers";
import { actionClient, authActionClient } from "@/lib/safeAction";
import { revalidatePath } from "next/cache";

export const sigInAction = actionClient
  .inputSchema(loginSchema)
  .action(async ({ parsedInput }) => {
    await signIn(parsedInput, await headers());
    redirect("/admin/dashboard", "replace");
  });

export const logoutAction = authActionClient.action(async () => {
  await logout(await headers());
  revalidatePath("/");
  redirect("/", "replace");
});

export const verifyEmailAction = actionClient
  .inputSchema(verifyEmailSchema)
  .action(async ({ parsedInput }) => {
    await verifyEmailResetPassword(parsedInput.email, await headers());
    redirect("/auth/verify-email", "replace");
  });

export const resetPasswordAction = actionClient
  .inputSchema(resetPasswordSchema)
  .action(async ({ parsedInput }) => {
    await resetPassword(parsedInput, await headers());
    redirect("/auth/signin", "replace");
  });
