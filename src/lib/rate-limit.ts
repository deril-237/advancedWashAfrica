"server-only";

import { createHash } from "node:crypto";
import { RateLimitError } from "@/lib/errors/appError";
import { RateLimiterMemory, RateLimiterRes } from "rate-limiter-flexible";
import { error } from "next/dist/build/output/log";

export const otpSendByIpRateLimit = new RateLimiterMemory({
  points: 10,
  duration: 60 * 60,
  blockDuration: 60 * 60,
  keyPrefix: "otp-send-ip",
});

export const otpSendByEmailRateLimit = new RateLimiterMemory({
  points: 3,
  duration: 60 * 60,
  blockDuration: 60 * 60,
  keyPrefix: "otp-send-email",
});

export const otpVerifyByIpRateLimit = new RateLimiterMemory({
  points: 15,
  duration: 10 * 60,
  blockDuration: 10 * 60,
  keyPrefix: "otp-verify-ip",
});

export const otpVerifyBySessionRateLimit = new RateLimiterMemory({
  points: 15,
  duration: 10 * 60,
  blockDuration: 10 * 60,
  keyPrefix: "otp-verify-ip",
});

export const contactMessageRateLimit = new RateLimiterMemory({
  points: 5,
  duration: 10 * 60,
  blockDuration: 10 * 60,
  keyPrefix: "contact-message-ip",
});

export const publicInscriptionRateLimit = new RateLimiterMemory({
  points: 5,
  duration: 60 * 60,
  blockDuration: 60 * 60,
  keyPrefix: "public-inscription-ip",
});

export const identityCheckRateLimit = new RateLimiterMemory({
  points: 30,
  duration: 60,
  blockDuration: 60,
  keyPrefix: "identity-check-ip",
});

export const uploadSignatureRateLimit = new RateLimiterMemory({
  points: 10,
  duration: 60 * 60,
  blockDuration: 60 * 60,
  keyPrefix: "upload-signature-ip",
});

/** Hash keys so email addresses and client IPs are not stored in plain text. */
export async function consumeRateLimit(
  limiter: RateLimiterMemory,
  key: string,
  message = "Trop de requêtes. Veuillez réessayer plus tard.",
) {
  const hashedKey = createHash("sha256").update(key).digest("hex");

  try {
    const result = await limiter.consume(hashedKey);

    return {
      consumedPoints: result.consumedPoints,
      remainingPoints: result.remainingPoints,
    };
  } catch (error) {
    if (error instanceof RateLimiterRes) {
      const waitingTime = Math.max(1, Math.ceil(error.msBeforeNext / 1000));
      throw new RateLimitError(waitingTime, message);
    }

    // Fail closed instead of silently skipping protection on unexpected errors.
    throw error;
  }
}
