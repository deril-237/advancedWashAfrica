import { randomInt } from "crypto";

export function pickFields<
  T extends object,
  const K extends readonly (keyof T)[],
>(obj: T, keys: K): Pick<T, K[number]> {
  const result = {} as Pick<T, K[number]>;

  for (const key of keys) {
    result[key] = obj[key];
  }

  return result;
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export function generateOtpCode(length = 6): string {
  const max = 10 ** length;
  const code = randomInt(0, max);
  return code.toString().padStart(length, "0");
}

export function formatWaitTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} seconde${seconds > 1 ? "s" : ""}`;
  }
  const minutes = Math.ceil(seconds / 60) - 1;

  const restSecond = seconds % 60;
  return `${minutes} minute: ${restSecond > 1 ? `${restSecond}s` : ""}`;
}
