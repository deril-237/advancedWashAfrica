"server-only";

import { auth } from "@/lib/betterAuth/auth";
import { ChangeEmailDTO, ResetPasswordDTO, SignInDTO } from "./types";
import { handleBetterAuthError } from "@/lib/errors/handlesError";

export async function signIn(
  { email, password, rememberMe }: SignInDTO,
  headers: Headers,
) {
  try {
    await auth.api.signInEmail({
      body: { email, password, callbackURL: "/admin", rememberMe },
      headers: headers,
    });
  } catch (error) {
    handleBetterAuthError(error, {
      UNAUTHORIZED: "Email ou mot de passe incorrect.",
      BAD_REQUEST: "Email ou mot de passe incorrect.",
      FORBIDDEN:
        "Votre compte n'est pas autorisé à accéder à cette application.",
      TOO_MANY_REQUESTS:
        "Trop de tentatives de connexion. Veuillez réessayer dans quelques minutes.",
      internal:
        "Une erreur est survenue lors de la connexion. Veuillez réessayer.",
    });
  }
}

export async function logout(headers: Headers) {
  try {
    await auth.api.signOut({ headers: headers });
  } catch (error) {
    handleBetterAuthError(error, {
      UNAUTHORIZED: "Votre session a déjà expiré.",
      internal:
        "Une erreur est survenue lors de la déconnexion. Veuillez réessayer.",
    });
  }
}

export async function verifyEmailResetPassword(
  email: string,
  headers: Headers,
) {
  try {
    await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: "/auth/reset-password",
      },
      headers,
    });
  } catch (error) {
    handleBetterAuthError(error, {
      BAD_REQUEST: "Adresse e-mail invalide.",
      internal:
        "Une erreur est survenue lors de l'envoi de l'e-mail de vérification. Veuillez réessayer.",
    });
  }
}

export async function resetPassword(data: ResetPasswordDTO, headers: Headers) {
  try {
    auth.api.requestPasswordReset;
    await auth.api.resetPassword({
      body: { ...data },
      headers: headers,
    });
  } catch (error) {
    handleBetterAuthError(error, {
      BAD_REQUEST: "Adresse e-mail invalide.",
      internal:
        "Une erreur est survenue lors de la réinitialisation du mot de passe. Veuillez réessayer.",
    });
  }
}

export async function ChangeAdminEmail({ newEmail, userId }: ChangeEmailDTO) {
  auth.api.changeEmail();

  return {};
}
