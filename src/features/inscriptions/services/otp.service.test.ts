import { createId } from "@paralleldrive/cuid2";
import bcrypt from "bcryptjs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { emailServiceMocked } from "@/test/mocks/email.mock";
import { prismaMock } from "@/test/mocks/prismaMock";
import {
  CodeError,
  ConflictError,
  NotFoundError,
  RateLimitError,
} from "@/lib/errors/appError";
import * as rateLimit from "@/lib/rate-limit";
import * as utils from "@/lib/utils";
import OtpVerificationEmail from "@/emails/templates/OtpCodeVerificationEmail";
import { getOtpCode, validateSession, verifyCode } from "./otp.service";
import { checkNumCniPassportAndEmail } from "./validation.service";

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));
vi.mock("@/lib/emails", () => ({ emailsService: emailServiceMocked }));
vi.mock("@/lib/rate-limit", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/rate-limit")>(
      "@/lib/rate-limit",
    );
  return { ...actual, consumeRateLimit: vi.fn() };
});
vi.mock("@/emails/templates/OtpCodeVerificationEmail", () => ({
  default: vi.fn(
    (props: {
      firstName: string;
      otpCode: string;
      expiresInMinutes: number;
    }) => ({ type: "OtpVerificationEmail", props }),
  ),
}));
vi.mock("./validation.service", () => ({
  checkNumCniPassportAndEmail: vi.fn(),
}));
vi.mock("./inscription.service", () => ({
  firstStudentInscription: vi.fn(),
  sendConfirmationMail: vi.fn(),
}));

describe("otp.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(utils, "generateOtpCode").mockReturnValue("1234");
    vi.spyOn(bcrypt, "hash").mockResolvedValue("hashed-code" as never);
    vi.mocked(rateLimit.consumeRateLimit).mockResolvedValue({
      consumedPoints: 1,
      remainingPoints: 2,
    });
  });

  describe("validateSession", () => {
    const sessionId = createId();

    it("throws when no session exists", async () => {
      prismaMock.otpCode.findUnique.mockResolvedValue(null);

      await expect(validateSession(sessionId)).rejects.toBeInstanceOf(
        NotFoundError,
      );
    });

    it("throws when session has expired", async () => {
      const expiredDate = Date.now();
      prismaMock.otpCode.findUnique.mockResolvedValue({
        id: sessionId,
        email: "student@example.com",
        codeHash: "hash",
        used: false,
        expiredAt: new Date(expiredDate),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      vi.setSystemTime(new Date(expiredDate + 2000));

      await expect(validateSession(sessionId)).rejects.toBeInstanceOf(
        ConflictError,
      );
    });

    it("returns the current session when it is still valid", async () => {
      const pendingSession = {
        id: sessionId,
        email: "student@example.com",
        codeHash: "hash",
        used: false,
        expiredAt: new Date(Date.now() + 10_000),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.otpCode.findUnique.mockResolvedValue(pendingSession);

      await expect(validateSession(sessionId)).resolves.toEqual(pendingSession);
    });
  });

  describe("getOtpCode", () => {
    const studentData = {
      email: "student@example.com",
      numCNIPassport: "ABC123",
    };

    it("rejects when validation fails before any OTP is created", async () => {
      vi.mocked(checkNumCniPassportAndEmail).mockRejectedValue(
        new ConflictError({ email: ["Cet email existe déjà"] }, "email exist"),
      );

      await expect(getOtpCode(studentData)).rejects.toMatchObject({
        code: CodeError.CONFLICT,
      });

      expect(rateLimit.consumeRateLimit).not.toHaveBeenCalled();
      expect(prismaMock.otpCode.create).not.toHaveBeenCalled();
    });

    it("normalizes the email and creates an OTP record on success", async () => {
      vi.mocked(checkNumCniPassportAndEmail).mockResolvedValue(undefined);
      prismaMock.otpCode.create.mockResolvedValue({ id: createId() });

      await expect(
        getOtpCode({
          email: "  Student@Example.com  ",
          numCNIPassport: "ABC123",
        }),
      ).resolves.toEqual({
        pendingId: expect.any(String),
      });

      expect(rateLimit.consumeRateLimit).toHaveBeenCalledWith(
        expect.any(Object),
        "student@example.com",
        "Trop de codes demandés pour cette adresse. Réessayez dans une heure.",
      );
      expect(prismaMock.otpCode.create).toHaveBeenCalledWith({
        data: {
          email: "student@example.com",
          codeHash: "hashed-code",
          expiredAt: expect.any(Date),
        },
      });
      expect(OtpVerificationEmail).toHaveBeenCalledWith({
        firstName: "Mr/Mme",
        otpCode: "1234",
        expiresInMinutes: 10,
      });
      expect(emailServiceMocked.sendMail).toHaveBeenCalledWith({
        to: "student@example.com",
        subject: "Verification d'email d'inscription ",
        react: {
          type: "OtpVerificationEmail",
          props: {
            firstName: "Mr/Mme",
            otpCode: "1234",
            expiresInMinutes: 10,
          },
        },
      });
    });

    it("propagates rate-limit errors", async () => {
      vi.mocked(checkNumCniPassportAndEmail).mockResolvedValue(undefined);
      vi.mocked(rateLimit.consumeRateLimit).mockRejectedValue(
        new RateLimitError(120, "Trop de codes demandés"),
      );

      await expect(
        getOtpCode({ email: "student@example.com", numCNIPassport: "ABC123" }),
      ).rejects.toBeInstanceOf(RateLimitError);
    });
  });

  describe("verifyCode", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.spyOn(bcrypt, "compare").mockResolvedValue(false as never);
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    const sessionId = createId();

    it("throws when the session does not exist", async () => {
      prismaMock.otpCode.findUnique.mockResolvedValue(null);

      await expect(verifyCode(sessionId, "1234")).rejects.toBeInstanceOf(
        NotFoundError,
      );
    });

    it("throws when the session has expired", async () => {
      const expiredDate = Date.now();
      prismaMock.otpCode.findUnique.mockResolvedValue({
        id: sessionId,
        email: "student@example.com",
        codeHash: "hash",
        used: false,
        expiredAt: new Date(expiredDate),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      vi.setSystemTime(new Date(expiredDate + 2000));

      await expect(verifyCode(sessionId, "1234")).rejects.toBeInstanceOf(
        ConflictError,
      );
    });

    it("throws when the OTP has already been used", async () => {
      prismaMock.otpCode.findUnique.mockResolvedValue({
        id: sessionId,
        email: "student@example.com",
        codeHash: "hashed-code",
        used: true,
        expiredAt: new Date(Date.now() + 1_000),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(verifyCode(sessionId, "1234")).rejects.toBeInstanceOf(
        ConflictError,
      );
    });

    it("throws when the code does not match", async () => {
      prismaMock.otpCode.findUnique.mockResolvedValue({
        id: sessionId,
        email: "student@example.com",
        codeHash: "hashed-code",
        used: false,
        expiredAt: new Date(Date.now() + 1_000),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(verifyCode(sessionId, "5678")).rejects.toBeInstanceOf(
        ConflictError,
      );
      expect(rateLimit.consumeRateLimit).toHaveBeenCalledWith(
        expect.any(Object),
        sessionId,
        "vous avez atteint le quota de tention possible",
      );
    });

    it("propagates the verify-rate-limit error when the limit is exhausted", async () => {
      prismaMock.otpCode.findUnique.mockResolvedValue({
        id: sessionId,
        email: "student@example.com",
        codeHash: "hashed-code",
        used: false,
        expiredAt: new Date(Date.now() + 1_000),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      vi.mocked(rateLimit.consumeRateLimit).mockRejectedValue(
        new RateLimitError(0, "vous avez atteint le quota de tention possible"),
      );

      await expect(verifyCode(sessionId, "5678")).rejects.toBeInstanceOf(
        RateLimitError,
      );
    });

    it("marks the session as used when the code matches", async () => {
      prismaMock.otpCode.findUnique.mockResolvedValue({
        id: sessionId,
        email: "student@example.com",
        codeHash: "hashed-code",
        used: false,
        expiredAt: new Date(Date.now() + 1_000),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

      await expect(verifyCode(sessionId, "1234")).resolves.toBeUndefined();
      expect(prismaMock.otpCode.update).toHaveBeenCalledWith({
        where: { id: sessionId },
        data: { used: true },
      });
    });
  });
});
