import { Identifier } from "@/interfaces/entities";
import { ConflictError, NotFoundError } from "@/lib/errors/appError";
import { prisma } from "@/lib/prisma";
import { checkNumCniOrPassportError } from "../errors";
import { StudentFirstInscriptionDTO } from "../types";

export async function checkNumCniPassportAndEmail(
  numCNIPassport: string,
  email: string,
) {
  const [studentByCni, studentByEmail] = await Promise.all([
    prisma.student.findFirst({
      where: { numCNIPassport },
      select: { id: true },
    }),
    prisma.student.findFirst({
      where: { email },
      select: { id: true },
    }),
  ]);

  if (studentByCni) {
    throw new ConflictError<keyof StudentFirstInscriptionDTO>(
      checkNumCniOrPassportError.cniOrPassport,
    );
  }

  if (studentByEmail) {
    throw new ConflictError<keyof StudentFirstInscriptionDTO>(
      checkNumCniOrPassportError.email,
    );
  }
}

export async function checkWave(trainingProgramId: Identifier) {
  const wave = await prisma.wave.findFirst({
    where: {
      trainingProgramId: trainingProgramId,
      status: {
        not: "OPEN",
      },
    },
    select: {
      id: true,
      quota: true,
      _count: {
        select: { inscriptions: true },
      },
    },
  });

  if (!wave || wave._count.inscriptions >= wave.quota) {
    throw new NotFoundError(
      "Les inscriptions pour cette formation ne sont pas ouvertes",
    );
  }

  return wave;
}
