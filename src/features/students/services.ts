"server-only";

import { Identifier } from "@/interfaces/entities";
import { NotFoundError } from "@/lib/errors/appError";
import { handlePrismaError } from "@/lib/errors/handlesError";
import { StudentWhereInput } from "@/lib/generated/prisma/models";
import {
  buildPaginatedResult,
  getPaginationParams,
  PaginationParams,
} from "@/lib/pagination";
import { prisma } from "@/lib/prisma";
import { minimalFileFields } from "../fileAssets";
import { waveWithTrainingProgram } from "../waves";
import {
  motivation,
  selectDocuments,
  selectStudentInformation,
} from "./constants";
import {
  FilterStudent,
  StudentList,
  UpdateStudentDocument,
  UpdateStudentInformationDTO,
} from "./types";
import { getUrl } from "@/lib/StorageService/cloudinary/cloudinary-signer";
import { ALLOWED_MIME_TYPES_LIST } from "@/lib/StorageService";

// students
export async function getStudentList(
  paginationParams: PaginationParams,
  filter?: FilterStudent,
): Promise<StudentList> {
  const params = getPaginationParams(paginationParams);

  const where: StudentWhereInput = {};

  if (filter?.search) {
    where.OR = [
      { numCNIPassport: { contains: filter?.search } },
      { name: { contains: filter?.search } },
      { secondName: { contains: filter?.search } },
    ];
  }

  if (filter?.waveId) {
    where.inscriptions = {
      some: { waveId: filter?.waveId },
    };
  }

  const [student, totalItems] = await Promise.all([
    prisma.student.findMany({
      distinct: "id",
      select: {
        ...selectStudentInformation,
        photoFile: {
          select: minimalFileFields,
        },
      },
      where,
      take: params.limit,
      skip: params.skip,
    }),
    prisma.student.count({ where }),
  ]);

  return buildPaginatedResult(
    student.map((student) => ({
      ...student,
      photoFile: {
        ...student.photoFile,
        url: getUrl(
          student.photoFile.key,
          student.photoFile.mimeType as ALLOWED_MIME_TYPES_LIST,
        ),
      },
    })),
    {
      currentPage: params.page,
      totalItems,
      limit: params.limit,
    },
  );
}

export async function getStudentDetail(studentId: Identifier) {
  const wave = {
    select: waveWithTrainingProgram,
  };

  const inscriptions = {
    select: {
      id: true,
      modality: true,
      reasonRejected: true,
      status: true,
      waveId: true,
      wave,
    },
  };

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      ...selectDocuments,
      motivations: { select: motivation },
      inscriptions,
    },
  });

  if (student === null) {
    throw new NotFoundError(`L'etudiant n'exsite pas`);
  }

  return student;
}

export async function updateStudentDocument(
  studentId: Identifier,
  documents: UpdateStudentDocument,
) {
  const documentsUpdate = prisma.student.update({
    where: { id: studentId },
    data: {
      photoFile: {
        update: documents.cniPassport,
      },
      cniPassportFile: {
        update: documents.cniPassport,
      },
      diplomaFile: {
        update: documents.diploma,
      },
    },
    select: {
      ...selectDocuments,
    },
  });
}

export async function updateStudentInformation(
  studentId: Identifier,
  data: UpdateStudentInformationDTO,
) {
  try {
    const student = await prisma.student.update({
      data,
      where: {
        id: studentId,
      },
      select: {
        ...selectStudentInformation,
        residence: true,
        birthDate: true,
        birthPlace: true,
      },
    });

    return student;
  } catch (error) {
    handlePrismaError<keyof UpdateStudentInformationDTO | "studentId">(error, {
      unique: {
        fields: {
          numCNIPassport: ["Un autre étudiant utilise déja ce numéro"],
          email: ["Un autre étudiant utilise déja cette email"],
        },
      },
      foreignKey: {
        studentId: "Il n'existe aucun étudiant avec cette identifiant",
      },
      notExist:
        "Il n'existe aucun un étudiant avec cette identifiant n'existe pas",
    });
  }
}

export async function getStudentStatistics() {
  const [total, totalStudentFinishTraining, StudentInTraining] =
    await Promise.all([
      prisma.student.count({
        where: {
          inscriptions: { some: { status: "ACCEPTED" } },
        },
      }),
      prisma.student.count({
        where: {
          inscriptions: {
            some: { status: "ACCEPTED", wave: { status: "PENDING" } },
          },
        },
      }),
      prisma.student.count({
        where: {
          inscriptions: {
            some: { status: "ACCEPTED", wave: { status: "FINISHED" } },
          },
        },
      }),
    ]);

  return {
    totalStudentFinishTraining,
    totalStudent: total,
    totalStudentInTraining: StudentInTraining,
  };
}
