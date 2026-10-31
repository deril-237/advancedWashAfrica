"server-only";

import { createSafeActionClient, SafeActionResult } from "next-safe-action";
import { resolverError } from "./errors/resolverError";
import { ForbiddenError } from "./errors/appError";
import { getSession } from "./betterAuth/auth-server";

export const actionClient = createSafeActionClient({
  handleServerError(error) {
    const result = resolverError(error);
    return result;
  },
  defaultValidationErrorsShape: "flattened",
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const session = await getSession();

  if (!session) {
    throw new ForbiddenError(
      "Vous n'avez pas l'authorisation d'effectuer cette action",
    );
  }

  return next({ ctx: { user: session.user } });
});

export async function unwrap<TError, TSchema, TData>(
  promise: Promise<SafeActionResult<TError, undefined, TSchema, TData>>,
  message?: string,
): Promise<TData> {
  const result = await promise;

  if (!result.data || result.serverError || result.validationErrors) {
    throw new Error(message ?? "Erreur est survenue pendant le traitement");
  }

  return result.data;
}
