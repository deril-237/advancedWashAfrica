"server-only";

export const CodeError = {
  VALIDATION: "VALIDATION",
  BAD_REQUEST: "BAD_REQUEST",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  TOO_MANY_REQUEST: "TOO_MANY_REQUEST",
} as const;

export type CodeError = (typeof CodeError)[keyof typeof CodeError];

export abstract class AppError extends Error {
  abstract readonly code: CodeError;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, new.target.prototype);

    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class InternalError extends AppError {
  readonly code = "INTERNAL_ERROR";

  constructor(message = "Une erreur interne est survenue.") {
    super(message);
  }
}

export class BadRequestError extends AppError {
  readonly code = "BAD_REQUEST";

  constructor(message = "Requête invalide.") {
    super(message);
  }
}

export class UnauthorizedError extends AppError {
  readonly code = "UNAUTHORIZED";

  constructor(message = "Vous devez être authentifié.") {
    super(message);
  }
}

export class ForbiddenError extends AppError {
  readonly code = "FORBIDDEN";

  constructor(message = "Vous n'avez pas les permissions nécessaires.") {
    super(message);
  }
}

export class NotFoundError extends AppError {
  readonly code = "NOT_FOUND";

  constructor(message = "Ressource introuvable.") {
    super(message);
  }
}

export class ConflictError<TFields extends string = string> extends AppError {
  readonly code = "CONFLICT";

  constructor(
    public readonly fieldErrors: Partial<
      Record<TFields, string[]> | undefined
    > = undefined,
    public readonly global = "",
    meta?: Record<string, any>,
  ) {
    super(global);
  }
}

export class RateLimitError extends AppError {
  readonly code = "TOO_MANY_REQUEST";

  constructor(
    public waitingTime: number = 3 * 60,
    message = "trop de requetes",
  ) {
    super(message);
  }
}
