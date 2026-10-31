"server-only";

import { prisma } from "@/lib/prisma";
import { handlePrismaError } from "@/lib/errors/handlesError";
import { Identifier } from "@/interfaces/entities";
import { CreateProgramDTO, UpdateProgramDTO } from "./types";
import { ConflictError } from "@/lib/errors/appError";

export async function createProgram(programData: CreateProgramDTO) {
  try {
    const result = await prisma.program.create({ data: programData });

    return result;
  } catch (error) {
    handlePrismaError<keyof CreateProgramDTO>(error, {
      unique: {
        fields: { duration: ["un parcours avec cette durée existe déja"] },
        global: "un parcours avec cette durée existe déja",
      },
      internalError: "Erreur lors de l'enregistrement du parcour",
    });
  }
}

// export async function updateProgram(
//   programId: Identifier,
//   programData: UpdateProgramDTO,
// ) {
//   try {
//     const program = await prisma.program.update({
//       data: programData,
//       where: { id: programId },
//     });

//     return program;
//   } catch (error) {
//     handlePrismaError(error, {
//       internalError:
//         "Erreur lors de la mise à jour du parcour. Veuillez réessayer",
//       unique: {
//         global: "un parcours avec cette durée existe déja",
//       },
//       notExist: "ce parcour n'existe pas",
//     });
//   }
// }

export async function getListProgram() {
  const program = await prisma.program.findMany();

  return program;
}

export async function deleteProgram(programId: Identifier) {
  try {
    const nbTrainingProgram = await prisma.trainingProgram.count({
      where: { programId },
    });

    if (nbTrainingProgram) {
      throw new ConflictError(
        {},
        "Ce program est associé à des formations. Veillez supprimez premièrement le parcours des formations dans lequelle il est",
      );
    }
    const result = await prisma.program.delete({ where: { id: programId } });
    return result;
  } catch (error) {
    handlePrismaError(error, {
      notExist: `Le parcours n'existe`,
      foreignKey: { global: "Il existe des formations qui ont ce programs" },
    });
  }
}
