"server-only";

import { auth } from "@/lib/betterAuth/auth";
import { NotFoundError } from "@/lib/errors/appError";
import { prisma } from "@/lib/prisma";

export async function getAdmin() {
  const result = await prisma.user.findUnique({
    where: { email: process.env.ADMIN_EMAIL },
  });

  if (result === null) {
    throw new NotFoundError(`Aucun compte n'a encore été crée`);
  }

  return result;
}
