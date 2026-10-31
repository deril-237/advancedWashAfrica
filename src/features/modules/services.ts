"server-only";

import { prisma } from "@/lib/prisma";
import { CreateModuleDTO, UpdateModuleDTO } from "./types";
import { handlePrismaError } from "@/lib/errors/handlesError";
import { Identifier } from "@/interfaces/entities";

export async function createModule(data: CreateModuleDTO) {
  try {
    const module = await prisma.module.create({
      data,
    });

    return module;
  } catch (error) {
    handlePrismaError<keyof CreateModuleDTO>(error, {
      unique: { fields: { position: ["Un module pocède déja ce numéro"] } },
    });
  }
}

export function getModuleList(trainingProgramId: Identifier) {
  return prisma.module.findMany({
    where: { trainingProgramId },
    orderBy: { position: "asc" },
  });
}

export async function updateModule(
  moduleId: Identifier,
  data: UpdateModuleDTO,
) {
  try {
    const module = await prisma.module.update({
      data,
      where: { id: moduleId },
    });

    return module;
  } catch (error) {
    handlePrismaError<keyof CreateModuleDTO>(error, {
      unique: { fields: { position: ["Un module pocède déja ce numéro"] } },
      notExist: "Il n'existe pas de moudle avec cette identifiant",
    });
  }
}

export async function deleteModule(moduleId: Identifier) {
  try {
    const module = await prisma.module.delete({
      where: { id: moduleId },
    });

    return module;
  } catch (error) {
    handlePrismaError<keyof CreateModuleDTO>(error, {
      notExist: "Il n'existe pas de moudle avec cette identifiant",
    });
  }
}
