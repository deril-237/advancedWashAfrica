"server-only";

import { Identifier } from "@/interfaces/entities";
import {
  PaginationParams,
  getPaginationParams,
  buildPaginatedResult,
  DEFAULT_LIMIT,
  FIRST_PAGE,
  PaginatedResult,
} from "@/lib/pagination";
import { prisma } from "@/lib/prisma";
import {
  AddProgramInTrainingDTO,
  CreateTrainingDTO,
  TrainingList,
  TrainingProgramItem,
  UpdateTrainingDTO,
  UpdateTrainingProgramDTO,
} from "./types";
import { handlePrismaError } from "@/lib/errors/handlesError";
import { NotFoundError } from "@/lib/errors/appError";
import { minimalFileFields } from "../fileAssets";
import { TrainingProgramWhereInput } from "@/lib/generated/prisma/models";
import { getUrl } from "@/lib/StorageService/cloudinary/cloudinary-signer";
import { ALLOWED_MIME_TYPES_LIST } from "../../lib/StorageService/interfaces";

export async function getTrainingList(
  paginationParams: PaginationParams,
): Promise<TrainingList> {
  const { skip, page, limit } = getPaginationParams(paginationParams);
  const [trainings, totalItems] = await Promise.all([
    prisma.training.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        objective: true,
        imageId: true,
        image: {
          select: minimalFileFields,
        },
        _count: {
          select: {
            trainingPrograms: true,
          },
        },
      },
      skip,
      take: limit,
    }),
    prisma.training.count(),
  ]);

  const result = buildPaginatedResult(
    trainings.map((training) => ({
      ...training,
      image: training.image
        ? {
            ...training.image,
            url: getUrl(
              training.image?.key,
              training.image.mimeType as ALLOWED_MIME_TYPES_LIST,
            ),
          }
        : null,
    })),
    {
      currentPage: page,
      totalItems,
      limit,
    },
  );

  return result;
}

export async function getTrainingProgramList(
  trainingId?: Identifier,
  params: PaginationParams = { limit: DEFAULT_LIMIT, page: FIRST_PAGE },
): Promise<PaginatedResult<TrainingProgramItem>> {
  const where: TrainingProgramWhereInput = {};

  if (trainingId) {
    where.trainingId = trainingId;
  }

  const paginationParams = getPaginationParams(params);
  const [trainingProgram, totalItems] = await Promise.all([
    prisma.trainingProgram.findMany({
      select: {
        id: true,
        program: true,
        training: {
          select: {
            id: true,
            name: true,
            description: true,
            objective: true,
            image: { select: minimalFileFields },
          },
        },
        price: true,
      },
      where,
      skip: paginationParams.skip,
      take: paginationParams.limit,
    }),
    prisma.trainingProgram.count({
      where,
    }),
  ]);

  return buildPaginatedResult(
    trainingProgram.map((trProgram) => ({
      ...trProgram,
      training: {
        ...trProgram.training,
        image: trProgram.training.image
          ? {
              ...trProgram.training.image,
              url: getUrl(
                trProgram.training.image?.key,
                trProgram.training.image?.mimeType as ALLOWED_MIME_TYPES_LIST,
              ),
            }
          : null,
      },
    })),
    {
      totalItems,
      currentPage: paginationParams.page,
      ...paginationParams,
    },
  );
}

export async function createTraining(data: CreateTrainingDTO) {
  try {
    const training = await prisma.training.create({
      data: {
        name: data.name,
        objective: data.objective,
        description: data.description,
        image: {
          create: data.image,
        },
      },
    });

    return training;
  } catch (error) {
    handlePrismaError(error, {
      unique: { fields: { name: ["Une autre formation possède déja ce nom"] } },
      foreignKey: { programId: "Le parcours n'existe pas" },
    });
  }
}

export async function updateTraining(
  trainingId: Identifier,
  data: UpdateTrainingDTO,
) {
  try {
    const training = await prisma.training.update({
      where: { id: trainingId },
      data: {
        name: data.name,
        objective: data.objective,
        description: data.description,
        image: {
          update: {
            ...data.image,
          },
        },
      },
    });

    return training;
  } catch (error) {
    handlePrismaError(error, {
      notExist: "Il n'existe aucun formation avec cette identifiant",
    });
  }
}

export async function getTrainingProgram(trainingProgramId: Identifier) {
  const trainingProgram = await prisma.trainingProgram.findUnique({
    where: { id: trainingProgramId },
    select: {
      id: true,
      price: true,
      training: {
        select: {
          id: true,
          name: true,
          description: true,
          image: { select: minimalFileFields },
          objective: true,
        },
      },
      preRequests: {
        orderBy: { order: "asc" },
        select: { id: true, label: true, order: true },
      },
      carrerOpportunities: {
        orderBy: { label: "asc" },
        select: { id: true, label: true },
      },
      program: { select: { duration: true, id: true } },
    },
  });

  if (!trainingProgram) {
    throw new NotFoundError(`Aucun n'existe avec cette identifiant`);
  }
  return {
    ...trainingProgram,
    training: {
      ...trainingProgram.training,
      image: trainingProgram.training.image
        ? {
            ...trainingProgram.training.image,
            url: getUrl(
              trainingProgram.training.image.key,
              trainingProgram.training.image
                .mimeType as ALLOWED_MIME_TYPES_LIST,
            ),
          }
        : null,
    },
  };
}

export async function addProgramInTraining(
  trainingId: Identifier,
  data: AddProgramInTrainingDTO,
) {
  try {
    const trainingProgram = await prisma.trainingProgram.create({
      data: { trainingId, ...data },
    });

    return trainingProgram;
  } catch (error) {
    handlePrismaError(error, {
      unique: {
        global: "Ce parcours exsite dans cette formation",
      },
    });
  }
}

export async function removeProgramInTraining(trainingProgramId: Identifier) {
  try {
    const trainingProgram = await prisma.trainingProgram.delete({
      where: { id: trainingProgramId },
    });

    return trainingProgram;
  } catch (error) {
    handlePrismaError(error, { notExist: "Le parcours n'existe pas" });
  }
}

export async function updateProgramTraining(
  trainingProgramId: Identifier,
  data: UpdateTrainingProgramDTO,
) {
  try {
    const trainingProgram = await prisma.trainingProgram.update({
      where: { id: trainingProgramId },
      data,
    });

    return trainingProgram;
  } catch (error) {
    handlePrismaError(error, {
      notExist: "Le parcours n'existe pas dans la formatio selectionné",
    });
  }
}

export async function getTrainingDetails(trainingId: Identifier) {
  const training = await prisma.training.findUnique({
    where: { id: trainingId },
    select: {
      id: true,
      name: true,
      description: true,
      objective: true,
      imageId: true,
      image: {
        select: minimalFileFields,
      },
      trainingPrograms: {
        select: {
          id: true,
          price: true,
          program: {
            select: {
              id: true,
              duration: true,
            },
          },
        },
        orderBy: {
          program: {
            duration: "asc",
          },
        },
      },
      _count: {
        select: {
          trainingPrograms: true,
        },
      },
    },
  });

  if (training === null) {
    throw new NotFoundError(
      `Il n'exist pas de formation avec cette identifiant`,
    );
  }

  return {
    ...training,
    image: training.image
      ? {
          ...training.image,
          url: getUrl(
            training.image.key,
            training.image.mimeType as ALLOWED_MIME_TYPES_LIST,
          ),
        }
      : null,
  };
}

export async function getTOpTrainings(limit: number) {
  const trainings = await prisma.training.findMany({
    include: {
      image: true,
      trainingPrograms: {
        include: {
          _count: { select: { waves: true } },
          waves: {
            include: { _count: { select: { inscriptions: true } } },
          },
        },
      },
    },
  });

  const withCounts = trainings.map((training) => {
    const inscriptionCount = training.trainingPrograms.reduce(
      (sum, tp) =>
        sum + tp.waves.reduce((s, w) => s + w._count.inscriptions, 0),
      0,
    );

    return {
      id: training.id,
      name: training.name,
      image: training.image
        ? {
            ...training.image,
            url: getUrl(
              training.image.key,
              training.image.mimeType as ALLOWED_MIME_TYPES_LIST,
            ),
          }
        : null,
      inscriptionCount,
    };
  });

  return withCounts
    .sort((a, b) => b.inscriptionCount - a.inscriptionCount)
    .slice(0, limit);
}
