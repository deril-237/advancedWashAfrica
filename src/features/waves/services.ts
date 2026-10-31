"server-only";

import { prisma } from "@/lib/prisma";
import { handlePrismaError } from "@/lib/errors/handlesError";
import {
  FilterWave,
  Wave,
  WaveList,
  CreateWaveDTO,
  UpdateWaveDTO,
  WaveStatus,
} from "./types";
import { Identifier } from "@/interfaces/entities";
import { ConflictError } from "@/lib/errors/appError";
import { WaveWhereInput } from "@/lib/generated/prisma/models";

export async function createWave(waveData: CreateWaveDTO): Promise<Wave> {
  try {
    const lastWave = await prisma.wave.findFirst({
      orderBy: { startDate: "desc" },
      where: { trainingProgramId: waveData.trainingProgramId },
    });

    if (lastWave && lastWave.status !== "FINISHED") {
      throw new ConflictError(
        {},
        "Il existe déja une vague avec des inscriptions en cours pour ce parcours de formation",
      );
    }

    const trainingProgram = await prisma.trainingProgram.findUnique({
      where: { id: waveData.trainingProgramId },
      select: {
        id: true,
        price: true,
        program: { select: { id: true, duration: true } },
      },
    });

    if (waveData.startDate.getTime() < Date.now()) {
      throw new ConflictError({
        startDate: ["La date de début doit être dans le futur"],
      });
    }

    const delta =
      waveData.startDate.getTime() - (lastWave?.startDate.getTime() || 0);

    const durationInMs =
      (trainingProgram?.program.duration || 0) * 24 * 60 * 60 * 1000; // Convert duration from days to milliseconds

    if (delta < durationInMs) {
      throw new ConflictError({
        startDate: [
          "La date de début doit être après la date de fin de la vague précédente",
        ],
      });
    }

    if (trainingProgram === null) {
      throw new ConflictError({
        trainingProgramId: ["Ce programme n'existe pas"],
      });
    }
    const wave = await prisma.wave.create({
      data: {
        ...waveData,
        price: trainingProgram.price, // snapshop price
        status: WaveStatus.OPEN, // default status
      },
    });

    return wave;
  } catch (error) {
    if (error instanceof ConflictError) {
      throw error;
    }

    handlePrismaError<keyof CreateWaveDTO>(error, {
      unique: {
        fields: {
          startDate: ["Il existe une vague pour cette dans cette formation"],
        },
      },
      foreignKey: { trainingProgramId: "Cette formation n'existe pas" },
    });
  }
}

export async function getListWave(filter: FilterWave) /*:  Promise<WaveList>*/ {
  const where: WaveWhereInput = {
    status: filter.status,
    trainingProgram: {
      id: filter.trainingProgramId,
      program: { id: filter.programId },
      training: { id: filter.trainingId },
    },
  };

  const waves = await prisma.wave.findMany({
    where,
    select: {
      id: true,
      startDate: true,
      quota: true,
      status: true,
      price: true,
      trainingProgramId: true,
      createdAt: true,
      updatedAt: true,
      trainingProgram: {
        select: {
          id: true,
          program: { select: { id: true, duration: true } },
          training: { select: { id: true, name: true } },
        },
      },
    },
  });

  return waves;
}

export async function updateWave(
  waveId: Identifier,
  waveData: UpdateWaveDTO,
): Promise<Wave> {
  try {
    const result = await prisma.wave.update({
      where: { id: waveId },
      data: waveData,
    });

    return result;
  } catch (error) {
    handlePrismaError<keyof UpdateWaveDTO>(error, {
      internalError:
        "Erreur lors de la mise à jour de la vague. Veuillez réessayer",
      unique: {
        fields: {
          startDate: ["Un vague avec ce date existe déjà dans cette formation"],
        },
      },
      notExist: "ce vague n'existe pas",
    });
  }
}

export async function lockWaveCourse(waveId: Identifier): Promise<Wave> {
  try {
    let wave = await prisma.wave.findUniqueOrThrow({ where: { id: waveId } });

    wave.status = "FINISHED"; // finish course course

    wave = await prisma.wave.update({
      where: { id: waveId },
      data: wave,
    });

    return wave;
  } catch (error) {
    handlePrismaError<keyof UpdateWaveDTO>(error, {
      internalError:
        "Erreur lors de la mise à jour de la vague. Veuillez réessayer",
      notExist: "ce vague n'existe pas",
    });
  }
}

export async function unlockWaveCourse(waveId: Identifier): Promise<Wave> {
  try {
    let wave = await prisma.wave.findUniqueOrThrow({ where: { id: waveId } });

    wave.status = "PENDING"; // reopen course

    wave = await prisma.wave.update({
      where: { id: waveId },
      data: wave,
    });

    return wave;
  } catch (error) {
    handlePrismaError<keyof UpdateWaveDTO>(error, {
      internalError:
        "Erreur lors de la mise à jour de la vague. Veuillez réessayer",
      notExist: "ce vague n'existe pas",
    });
  }
}

export async function getStatistics() {
  const [total, nbOpen, nbPending, nbFinish] = await Promise.all([
    prisma.wave.count(),
    prisma.wave.count({ where: { status: "OPEN" } }),
    prisma.wave.count({ where: { status: "PENDING" } }),
    prisma.wave.count({ where: { status: "FINISHED" } }),
  ]);

  return { total, nbOpen, nbFinish, nbPending };
}
