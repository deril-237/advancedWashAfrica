"server-only";

import { auth } from "@/lib/betterAuth/auth";
import { ChangePasswordDTO } from "./types";
import { handleBetterAuthError } from "@/lib/errors/handlesError";

export async function changePassword(
  data: ChangePasswordDTO,
  headers: Headers,
) {
  try {
    const result = await auth.api.changePassword({
      body: {
        ...data,
        revokeOtherSessions: true,
      },
      headers,
    });

    return result;
  } catch (error) {
    handleBetterAuthError(error, {
      UNAUTHORIZED:
        "Vous devez être connecté pour modifier votre mot de passe.",
      BAD_REQUEST: "Le mot de passe actuel est incorrect.",
      FORBIDDEN: "Vous n'êtes pas autorisé à effectuer cette action.",
      TOO_MANY_REQUESTS:
        "Trop de tentatives ont été effectuées. Veuillez réessayer dans quelques minutes.",
      internal:
        "Une erreur est survenue lors de la mise à jour de votre mot de passe. Veuillez réessayer.",
    });
  }
}
