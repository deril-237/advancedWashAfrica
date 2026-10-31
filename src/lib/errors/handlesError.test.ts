import { describe, it, expect, vi } from "vitest";

vi.mock("server-only", () => ({})); // au cas où le module est importé tel quel

import {
  defaultMessage,
  handleBetterAuthError,
  handlePrismaError,
  prismaErrorCode,
} from "./handlesError";
import {
  AppError,
  BadRequestError,
  CodeError,
  ConflictError,
  ForbiddenError,
  InternalError,
  NotFoundError,
  RateLimitError,
  UnauthorizedError,
} from "./appError";
import { makePrismaError } from "@/test/mocks/prismaError";
import { APIError } from "better-auth";

const messages = {
  unique: {
    fields: { duration: ["Duration already used"] },
    global: "global conflict",
  },
  notExist: "program not found",
  internalError: "custom internal error",
  foreignKey: { programId: "program not found" },
};

const defaultAuthMessage = "Une erreur est survenue lors du traitement";

function catchError<T = unknown>(fn: () => unknown): T {
  try {
    fn();
  } catch (e) {
    return e as T;
  }
  throw new Error("The function should have raised an error");
}

describe("handlePrismaError", () => {
  it("re-throws an AppError as-is", () => {
    const original = new NotFoundError("already typed");
    expect(() => handlePrismaError(original, messages)).toThrow(original);
  });

  it("throw InternalError for no prisma error", () => {
    const err = catchError(() =>
      handlePrismaError(new Error("error"), messages),
    );
    expect(err).toBeInstanceOf(InternalError);
    expect((err as InternalError).message).toBe(messages.internalError);
  });

  it("use the default message if the internal no given", () => {
    const err = catchError(() => handlePrismaError(new Error("error"), {}));
    expect((err as InternalError).message).toBe(defaultMessage);
  });

  describe("P2002 (unique)", () => {
    it("throw ConflictError with errors by field (target array)", () => {
      const prismaErr = makePrismaError(prismaErrorCode.unique, {
        target: ["duration"],
      });
      const err = catchError(() => handlePrismaError(prismaErr, messages));

      expect(err).toBeInstanceOf(ConflictError);
      expect((err as ConflictError).fieldErrors).toEqual({
        duration: ["Duration already used"],
      });
      expect((err as ConflictError).global).toBe(messages.unique.global);
      expect((err as ConflictError).message).toBe(messages.unique.global);
    });

    it("manage a target of type string", () => {
      const prismaErr = makePrismaError(prismaErrorCode.unique, {
        target: "duration",
      });
      const err = catchError(() => handlePrismaError(prismaErr, messages));
      expect(err).toBeInstanceOf(ConflictError);
    });

    it("ignore the fields without message configured", () => {
      const prismaErr = makePrismaError(prismaErrorCode.unique, {
        target: ["otherFields"],
      });
      const err = catchError(() => handlePrismaError(prismaErr, messages));
      expect(err).toBeInstanceOf(ConflictError);
      expect((err as ConflictError).fieldErrors).toEqual({});
    });

    it("use the global message", () => {
      const prismaErr = makePrismaError("P2002", { target: ["duration"] });
      const err = catchError(() => handlePrismaError(prismaErr, {}));
      expect((err as ConflictError).message).toBe("Une donnée existe déjà.");
    });
  });

  it("P2025 → NotFoundError", () => {
    const err = catchError(() =>
      handlePrismaError(makePrismaError(prismaErrorCode.notExist), messages),
    );
    expect(err).toBeInstanceOf(NotFoundError);
    expect((err as NotFoundError).message).toBe("program not found");
  });

  it("P2003 → ForeignKeyError", () => {
    const err = catchError(() =>
      handlePrismaError(makePrismaError(prismaErrorCode.foreignKey), messages),
    );
    expect(err).toBeInstanceOf(ConflictError);
    // expect((err as ConflictError).message).toBe("program not found");
  });

  it("Unknown Prisma code (e.g., P2003 for now) → InternalError", () => {
    const err = catchError(() =>
      handlePrismaError(makePrismaError("P2004"), messages),
    );
    expect(err).toBeInstanceOf(InternalError);
    expect((err as InternalError).message).toBe(
      "Erreur liée à la base de données.",
    );
  });
});

type BetterAuthMessages = Parameters<typeof handleBetterAuthError>[1];

const mappedStatuses = [
  ["UNAUTHORIZED", UnauthorizedError, CodeError.UNAUTHORIZED],
  ["FORBIDDEN", ForbiddenError, CodeError.FORBIDDEN],
  ["BAD_REQUEST", BadRequestError, CodeError.BAD_REQUEST],
  ["TOO_MANY_REQUESTS", RateLimitError, CodeError.TOO_MANY_REQUEST],
] as const;

describe("handleBetterAuthError", () => {
  it.each([
    ["an Error", new Error("boom")],
    ["a string", "boom"],
    ["undefined", undefined],
  ])("re-throws %s as-is", (_label, value) => {
    const err = catchError(() => handleBetterAuthError(value));

    expect(err).toBe(value);
  });

  describe.each(mappedStatuses)("%s", (status, ErrorClass, code) => {
    const apiError = () => new APIError(status, { message: "Raw message" });

    it("throws the matching AppError", () => {
      const err = catchError<AppError>(() => handleBetterAuthError(apiError()));

      expect(err).toBeInstanceOf(ErrorClass);
      expect(err.code).toBe(code);
    });

    it("uses the default auth message when no messages are given", () => {
      const err = catchError<AppError>(() => handleBetterAuthError(apiError()));

      expect(err.message).toBe(defaultAuthMessage);
    });

    it("uses the custom message configured for this status", () => {
      const messages = { [status]: "Custom message" } as BetterAuthMessages;
      const err = catchError<AppError>(() =>
        handleBetterAuthError(apiError(), messages),
      );

      expect(err.message).toBe("Custom message");
    });

    it("falls back to the class default message when the status is not configured", () => {
      const err = catchError<AppError>(() =>
        handleBetterAuthError(apiError(), { internal: "Unrelated" }),
      );

      expect(err.message).toBe(new ErrorClass().message);
    });

    it("does not leak the original APIError message", () => {
      const err = catchError<AppError>(() => handleBetterAuthError(apiError()));

      expect(err.message).not.toContain("Raw message");
    });
  });

  describe("unmapped statuses", () => {
    it.each(["NOT_FOUND", "INTERNAL_SERVER_ERROR"] as const)(
      "throws an InternalError for %s",
      (status) => {
        const err = catchError<InternalError>(() =>
          handleBetterAuthError(new APIError(status)),
        );

        expect(err).toBeInstanceOf(InternalError);
        expect(err.code).toBe(CodeError.INTERNAL_ERROR);
      },
    );

    it("uses the internal message when provided", () => {
      const err = catchError<InternalError>(() =>
        handleBetterAuthError(new APIError("NOT_FOUND"), {
          internal: "Custom internal",
        }),
      );

      expect(err.message).toBe("Custom internal");
    });

    it("uses the default auth message when no messages are given", () => {
      const err = catchError<InternalError>(() =>
        handleBetterAuthError(new APIError("NOT_FOUND")),
      );

      expect(err.message).toBe(defaultAuthMessage);
    });

    it("falls back to the InternalError default when messages has no matching key", () => {
      const err = catchError<InternalError>(() =>
        handleBetterAuthError(new APIError("NOT_FOUND"), {
          UNAUTHORIZED: "Unrelated",
        }),
      );

      expect(err.message).toBe(new InternalError().message);
    });
  });
});
