import { Prisma } from "@/lib/generated/prisma/client";

export const waveWithTrainingProgram = {
  id: true,
  trainingProgramId: true,
  trainingProgram: {
    select: {
      id: true,
      program: {
        select: {
          id: true,
          duration: true,
        },
      },
      training: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
} satisfies Prisma.WaveSelect;
