import {
  AppError,
  InternalError,
  ConflictError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  CodeError,
  RateLimitError,
} from "./appError";

export interface AppActionError<TFields = {}> {
  code: CodeError;

  global?: string;

  fieldErrors?: Partial<Record<keyof TFields, string[]>>;

  details?: string;

  meta?: { waitingTime: number };
}

export function resolverError<TFields extends object = {}>(
  error: unknown,
): AppActionError<TFields> {
  if (error instanceof BadRequestError) {
    return {
      code: error.code,
      global: error.message,
    };
  }

  if (error instanceof UnauthorizedError) {
    return {
      code: error.code,
      global: error.message,
    };
  }

  if (error instanceof ForbiddenError) {
    return {
      code: error.code,
      global: error.message,
    };
  }

  if (error instanceof ConflictError) {
    return {
      code: error.code,
      global: error.global,
      fieldErrors: error.fieldErrors as Partial<
        Record<keyof TFields, string[]>
      >,
    };
  }

  if (error instanceof NotFoundError) {
    return {
      code: error.code,
      global: error.message,
    };
  }

  if (error instanceof InternalError) {
    return {
      code: error.code,
      global: error.message,
    };
  }

  if (error instanceof RateLimitError) {
    return {
      code: error.code,
      global: error.message,
      meta: { waitingTime: error.waitingTime },
    };
  }

  if (error instanceof AppError) {
    return {
      code: error.code,
      global: error.message,
    };
  }

  return {
    code: "INTERNAL_ERROR",
    global: "Une erreur inattendue est survenue.",
    details: error instanceof Error ? error.message : String(error),
  };
}
