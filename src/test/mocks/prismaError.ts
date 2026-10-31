import { Prisma } from "@/lib/generated/prisma/client";

export function makePrismaError(code: string, meta?: Record<string, unknown>) {
  return new Prisma.PrismaClientKnownRequestError("Prisma error", {
    code,
    clientVersion: "test",
    meta,
  });
}
