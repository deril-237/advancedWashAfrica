"server-only";

import { prisma } from "@/lib/prisma";
import { CreatePreRequestDTO, UpdatePreRequestDTO } from "./types";
import { handlePrismaError } from "@/lib/errors/handlesError";
import { Identifier } from "@/interfaces/entities";

export async function createPreRequest(data: CreatePreRequestDTO) {
  try {
    const preRequest = await prisma.preRequest.create({
      data,
    });

    return preRequest;
  } catch (error) {
    handlePrismaError<keyof CreatePreRequestDTO>(error, {
      unique: { fields: { order: ["Un prérequis possède déjà ce numéro d'ordre"] } },
    });
  }
}

export function getPreRequestList(trainingProgramId: Identifier) {
  return prisma.preRequest.findMany({
    where: { trainingProgramId },
    orderBy: { order: "asc" },
  });
}

export async function updatePreRequest(
  preRequestId: Identifier,
  data: UpdatePreRequestDTO,
) {
  try {
    const preRequest = await prisma.preRequest.update({
      data,
      where: { id: preRequestId },
    });

    return preRequest;
  } catch (error) {
    handlePrismaError<keyof CreatePreRequestDTO>(error, {
      unique: { fields: { order: ["Un prérequis possède déjà ce numéro d'ordre"] } },
      notExist: "Il n'existe pas de prérequis avec cet identifiant",
    });
  }
}

export async function deletePreRequest(preRequestId: Identifier) {
  try {
    const preRequest = await prisma.preRequest.delete({
      where: { id: preRequestId },
    });

    return preRequest;
  } catch (error) {
    handlePrismaError<keyof CreatePreRequestDTO>(error, {
      notExist: "Il n'existe pas de prérequis avec cet identifiant",
    });
  }
}
