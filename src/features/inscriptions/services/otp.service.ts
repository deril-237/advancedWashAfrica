import OtpVerificationEmail from "@/emails/templates/OtpCodeVerificationEmail";
import { Identifier } from "@/interfaces/entities";
import { emailsService } from "@/lib/emails";
import { ConflictError, NotFoundError } from "@/lib/errors/appError";
import { prisma } from "@/lib/prisma";
import {
  consumeRateLimit,
  otpSendByEmailRateLimit,
  otpVerifyBySessionRateLimit,
} from "@/lib/rate-limit";
import { generateOtpCode } from "@/lib/utils";
import bcrypt from "bcryptjs";
import { RateLimiterMemory } from "rate-limiter-flexible";
import {
  lengthOtpCode,
  nbAttempts,
  validityPeriodOtpCodeInSecond,
} from "../constants";
import { GetOtpCodeDTO } from "../types";
import { checkNumCniPassportAndEmail } from "./validation.service";

const checkOtpCodeRateLimit = new RateLimiterMemory({
  points: nbAttempts,
  duration: validityPeriodOtpCodeInSecond,
});

export async function getOtpCode({
  email,
  numCNIPassport: numCNI,
}: GetOtpCodeDTO) {
  const normalizedEmail = email.trim().toLowerCase();

  await checkNumCniPassportAndEmail(numCNI, normalizedEmail);
  await consumeRateLimit(
    otpSendByEmailRateLimit,
    normalizedEmail,
    "Trop de codes demandés pour cette adresse. Réessayez dans une heure.",
  );

  const otpCode = generateOtpCode(lengthOtpCode);
  const codeHash = await bcrypt.hash(otpCode, 10);

  const pending = await prisma.otpCode.create({
    data: {
      email: normalizedEmail,
      codeHash,
      expiredAt: new Date(Date.now() + validityPeriodOtpCodeInSecond * 1000),
    },
  });

  await emailsService.sendMail({
    to: normalizedEmail,
    subject: "Verification d'email d'inscription ",
    react: OtpVerificationEmail({
      firstName: "Mr/Mme",
      otpCode,
      expiresInMinutes: validityPeriodOtpCodeInSecond / 60,
    }),
  });

  return { pendingId: pending.id };
}

export async function verifyCode(pendingId: string, code: string) {
  const pendingRegistration = await validateSession(pendingId);

  if (pendingRegistration.used) {
    throw new ConflictError({}, "Ce code a expire. Remandé un code OTP");
  }

  const isExact = await bcrypt.compare(code, pendingRegistration.codeHash);

  if (!isExact) {
    const { remainingPoints } = await consumeRateLimit(
      otpVerifyBySessionRateLimit,
      pendingRegistration.id,
      "vous avez atteint le quota de tention possible",
    );

    throw new ConflictError(
      { code: [`Code incorrect. Il vous manque ${remainingPoints} tentative`] },
      `Code incorrect. Il vous manque ${remainingPoints} tentative`,
    );
  }

  await checkOtpCodeRateLimit.delete(pendingRegistration.email);
  await prisma.otpCode.update({
    where: { id: pendingRegistration.id },
    data: { used: true },
  });
}

export async function validateSession(sessionId: Identifier) {
  const pendingRegistration = await prisma.otpCode.findUnique({
    where: { id: sessionId },
  });

  if (!pendingRegistration) {
    throw new NotFoundError("Aucune session d'inscription en cours");
  }

  if (pendingRegistration.expiredAt.getTime() < Date.now()) {
    throw new ConflictError({}, "Code expiré, redemande un OTP");
  }

  return pendingRegistration;
}
