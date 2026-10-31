"client-only";

import { FieldPath, FieldValues, UseFormSetError } from "react-hook-form";

import { AppActionError } from "@/lib/errors/resolverError";

type ApplyActionErrorsOptions = {
  onUnhandledError?: (message: string) => void;
};

export function applyActionErrors<TFieldValues extends FieldValues>(
  error: AppActionError<TFieldValues>,
  setError: UseFormSetError<TFieldValues>,
  options?: ApplyActionErrorsOptions,
): void {
  /**
   * field error
   */
  if (error.fieldErrors) {
    Object.entries(error.fieldErrors).forEach(([field, messages]) => {
      if (!messages || messages.length === 0) {
        return;
      }

      setError(field as FieldPath<TFieldValues>, {
        type: "server",
        message: messages[0],
      });
    });
  }

  /**
   * global messages
   */
  if (error.global) {
    setError("root", {
      type: "server",
      message: error.global,
    });
  }

  /**
   * Internal error
   */
  if (error.code === "INTERNAL_ERROR") {
    const message =
      "Une erreur est survenue pendant le traitement du formulaire. Réessayez ou contactez le département IT.";

    setError("root", {
      type: "server",
      message,
    });

    options?.onUnhandledError?.(message);
  }
}
