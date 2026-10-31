"server-only";

import { APIError } from "better-auth";
import { Prisma } from "../generated/prisma/client";

import {
  AppError,
  BadRequestError,
  ConflictError,
  ForbiddenError,
  InternalError,
  NotFoundError,
  RateLimitError,
  UnauthorizedError,
} from "./appError";

export const prismaErrorCode = {
  unique: "P2002",
  foreignKey: "P2003",
  notExist: "P2025",
} as const;

type ErrorMap<Key extends string = string> = {
  unique?: {
    fields?: Partial<Record<Key, string[]>>;
    global?: string;
  };

  foreignKey?: Partial<Record<Key, string>>;

  notExist?: string;

  internalError?: string;
};

export const defaultMessage = "Une erreur est survenue pendant l'opération.";

export function handlePrismaError<T extends string = string>(
  error: unknown,
  errorsMessage: ErrorMap<T>,
): never {
  console.error("Prisma error", error);
  if (error instanceof AppError) {
    throw error;
  }

  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    throw new InternalError(errorsMessage.internalError ?? defaultMessage);
  }

  if (error.code === prismaErrorCode.unique) {
    const target = error.meta?.target as string[] | string | undefined;

    const fields = Array.isArray(target) ? target : target ? [target] : [];

    const fieldErrors: Partial<Record<T, string[]>> = {};

    for (const field of fields) {
      const message = errorsMessage.unique?.fields?.[field as T];

      if (message) {
        fieldErrors[field as T] = message;
      }
    }

    throw new ConflictError<T>(
      fieldErrors,
      errorsMessage.unique?.global ?? "Une donnée existe déjà.",
    );
  }

  if (error.code === prismaErrorCode.notExist) {
    throw new NotFoundError(errorsMessage.notExist ?? "Ressource introuvable.");
  }

  console.error("Prisma error", error.code, error.meta, error.message);

  if (error.code === prismaErrorCode.foreignKey) {
    const fieldName = String(error.meta?.field_name ?? "");

    const field = fieldName
      .toLowerCase()
      .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()) as T;

    const message =
      errorsMessage.foreignKey?.[field] ??
      "Une erreur de relation est survenue.";

    const errors = {
      [field]: [message],
    } as Partial<Record<T, string[]>>;

    throw new ConflictError<T>(errors);
  }

  throw new InternalError("Erreur liée à la base de données.");
}

export function handleBetterAuthError(
  error: unknown,
  messages?: Partial<Record<APIError["status"], string>> & {
    internal?: string;
  },
): never {
  if (!(error instanceof APIError)) {
    throw error;
  }

  const defaultAuthMessage = "Une erreur est survenue lors du traitement";
  const message =
    messages?.[error.status] ??
    (messages === undefined ? defaultAuthMessage : undefined);

  switch (error.status) {
    case "UNAUTHORIZED":
      throw new UnauthorizedError(message);
    case "FORBIDDEN":
      throw new ForbiddenError(message);
    case "TOO_MANY_REQUESTS":
      throw new RateLimitError(undefined, message);
    case "BAD_REQUEST":
      throw new BadRequestError(message);
    default:
      throw new InternalError(
        messages?.internal ??
          (messages === undefined ? defaultAuthMessage : undefined),
      );
  }
}
