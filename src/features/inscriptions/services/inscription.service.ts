"server-only";

import { AcceptedInscriptionEmail } from "@/emails/templates/AcceptedInscriptionEmail";
import { InscriptionConfirmationEmailToAdmin } from "@/emails/templates/InscriptionConfirmationMailToAdmin";
import { RejectedInscriptionEmail } from "@/emails/templates/RejectedInscriptionEmail";
import { Identifier } from "@/interfaces/entities";
import { emailsService } from "@/lib/emails";
import { ConflictError, NotFoundError } from "@/lib/errors/appError";
import { handlePrismaError } from "@/lib/errors/handlesError";
import { InscriptionWhereInput } from "@/lib/generated/prisma/models/Inscription";
import {
  buildPaginatedResult,
  getPaginationParams,
  PaginationParams,
} from "@/lib/pagination";
import { prisma } from "@/lib/prisma";
import { minimalFileFields } from "../../fileAssets";
import { getTrainingProgram } from "../../trainings/services";
import { getAdmin } from "../../users";
import { waveWithTrainingProgram } from "../../waves";
import { checkNumCniPassportAndEmail, checkWave } from "./validation.service";
import {
  FilterInscription,
  FirstInscriptionResult,
  InscriptionStatus,
  RejectInscriptionDTO,
  StudentFirstInscriptionDTO,
  StudentMotivation,
  StudentSecondInscriptionDTO,
} from "../types";
import { buildCloudinarySignature } from "@/lib/StorageService/cloudinary/cloudinary-signer";

const folders = {
  diploma: "diploma",
  studentPhoto: "student-photo",
  cniPassport: "cni-passport",
};

const selectDocuments = {
  diplomaFile: { select: minimalFileFields },
  photoFile: { select: minimalFileFields },
  cniPassportFile: { select: minimalFileFields },
};

export async function firstStudentInscription(
  dataInscription: StudentFirstInscriptionDTO,
  status: InscriptionStatus = InscriptionStatus.SUBMITTED,
): Promise<FirstInscriptionResult> {
  const [wave] = await Promise.all([
    checkWave(dataInscription.trainingProgramId),
    checkNumCniPassportAndEmail(
      dataInscription.numCNIPassport,
      dataInscription.email,
    ),
  ]);

  const motivations: Pick<StudentMotivation, "optionId" | "textResponse">[] =
    dataInscription.motivations?.map((motivation) => ({
      optionId: motivation,
      textResponse: null,
    })) ?? [];

  if (dataInscription.otherMotivation) {
    motivations.push({
      textResponse: dataInscription.otherMotivation,
      optionId: null,
    });
  }

  const student = await prisma.student.create({
    data: {
      numCNIPassport: dataInscription.numCNIPassport,
      name: dataInscription.name,
      secondName: dataInscription.secondName,
      birthDate: dataInscription.birthDate,
      birthPlace: dataInscription.birthPlace,
      email: dataInscription.email,
      residence: dataInscription.residence,
      phone: dataInscription.phone,
      diplomaFile: { create: dataInscription.diploma },
      photoFile: { create: dataInscription.photo },
      cniPassportFile: { create: dataInscription.cniPassport },
      inscriptions: {
        create: {
          modality: dataInscription.modality,
          waveId: wave.id,
          status: status,
        },
      },
      motivations: {
        createMany: { data: motivations },
      },
    },
    select: {
      email: true,
      id: true,
      name: true,
      secondName: true,
      phone: true,
      numCNIPassport: true,
      inscriptions: { select: { id: true, createdAt: true } },
    },
  });

  return student;
}

export async function firstInscriptionByAdmin(
  data: StudentFirstInscriptionDTO,
) {
  const result = await firstStudentInscription(
    data,
    InscriptionStatus.ACCEPTED,
  );
  return result;
}

export async function secondStudentInscription(
  studentId: Identifier,
  { trainingProgramId, modality }: StudentSecondInscriptionDTO,
) {
  const wave = await checkWave(trainingProgramId);

  try {
    const inscription = await prisma.inscription.create({
      data: {
        studentId: studentId,
        waveId: wave.id,
        modality: modality,
        status: "ACCEPTED",
      },
    });

    return inscription;
  } catch (error) {
    handlePrismaError<keyof StudentSecondInscriptionDTO | "studentId">(error, {
      unique: {
        global: "L'etudiant c'est déja inscrit dans cette formation",
      },
      foreignKey: {
        studentId: "Il n'existe aucun étudiant avec cette identifiant",
      },
    });
  }
}

export async function getInscriptionList(
  paginationParams: PaginationParams,
  filter: FilterInscription,
) {
  const where: InscriptionWhereInput = {};

  if (filter.trainingProgramId) {
    where.wave = { trainingProgramId: filter.trainingProgramId };
  }

  if (filter.search) {
    where.student = {
      OR: [
        { numCNIPassport: { contains: filter?.search } },
        { name: { contains: filter?.search } },
        { secondName: { contains: filter?.search } },
      ],
    };
  }

  if (filter.status) {
    where.status = filter.status;
  }

  const select = {
    id: true,
    status: true,
    modality: true,
    createdAt: true,
    updatedAt: true,
    student: {
      select: {
        id: true,
        name: true,
        secondName: true,
        photoFile: selectDocuments.photoFile,
      },
    },
    wave: { select: waveWithTrainingProgram },
  };

  const params = getPaginationParams(paginationParams);

  const [total, items] = await Promise.all([
    prisma.inscription.count({ where }),
    prisma.inscription.findMany({
      where,
      skip: params.skip,
      take: params.limit,
      select,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return buildPaginatedResult(items, {
    currentPage: params.page,
    limit: params.limit,
    totalItems: total,
  });
}

export async function getInscription(inscriptionId: Identifier) {
  const inscription = await prisma.inscription.findUnique({
    where: { id: inscriptionId },
    select: {
      id: true,
      status: true,
      modality: true,
      reasonRejected: true,
      createdAt: true,
      updatedAt: true,
      student: {
        select: { name: true, secondName: true, email: true },
      },
      wave: {
        select: { ...waveWithTrainingProgram, status: true },
      },
    },
  });

  if (!inscription) {
    throw new NotFoundError(
      "Il n'existe aucun étudiant avec cette identifiant",
    );
  }

  if (inscription.status !== InscriptionStatus.SUBMITTED) {
    throw new ConflictError({}, "Ce dossier a déjà été traité");
  }

  if (inscription.wave.status === "FINISHED") {
    throw new ConflictError(
      {},
      "Ce dossier ne peut plus etre accepté car la vague pour laquelle le candidat à soucris est terminé",
    );
  }

  const inscriptionUpdated = await prisma.inscription.update({
    where: { id: inscriptionId },
    data: { status: InscriptionStatus.ACCEPTED },
    select: {
      id: true,
      modality: true,
      waveId: true,
      status: true,
      studentId: true,
    },
  });

  await emailsService.sendMail({
    to: inscription.student.email,
    subject: "Response à votre inscription",
    react: AcceptedInscriptionEmail({
      studentName: inscription.student.name,
      trainingName: `${inscription.wave.trainingProgram.training.name} durrée: ${inscription.wave.trainingProgram.program.duration} mois`,
    }),
  });

  return inscriptionUpdated;
}

export async function acceptInscription(inscriptionId: Identifier) {
  const inscription = await prisma.inscription.findUnique({
    where: { id: inscriptionId },
    select: {
      status: true,
      student: { select: { name: true, secondName: true, email: true } },
      wave: {
        select: {
          status: true,
          trainingProgram: {
            select: {
              program: { select: { id: true, duration: true } },
              training: { select: { id: true, name: true } },
            },
          },
        },
      },
    },
  });

  if (!inscription) {
    throw new NotFoundError(
      "Il n'existe aucun étudiant avec cette identifiant",
    );
  }

  if (inscription.status !== InscriptionStatus.SUBMITTED) {
    throw new ConflictError({}, "Ce dossier a déjà été traité");
  }

  if (inscription.wave.status === "FINISHED") {
    throw new ConflictError(
      {},
      "Ce dossier ne peut plus etre accepté car la vague pour laquelle le candidat à soucris est terminé",
    );
  }

  const inscriptionUpdated = await prisma.inscription.update({
    where: { id: inscriptionId },
    data: { status: InscriptionStatus.ACCEPTED },
    select: {
      id: true,
      modality: true,
      waveId: true,
      status: true,
      studentId: true,
    },
  });

  await emailsService.sendMail({
    to: inscription.student.email,
    subject: "Response à votre inscription",
    react: AcceptedInscriptionEmail({
      studentName: inscription.student.name,
      trainingName: `${inscription.wave.trainingProgram.training.name} durrée: ${inscription.wave.trainingProgram.program.duration} mois`,
    }),
  });

  return inscriptionUpdated;
}

export async function rejectInscription(
  inscriptionId: Identifier,
  data: RejectInscriptionDTO,
) {
  const inscription = await prisma.inscription.findUnique({
    where: { id: inscriptionId },
    select: {
      status: true,
      student: { select: { name: true, secondName: true, email: true } },
      wave: {
        select: {
          status: true,
          trainingProgram: {
            select: {
              program: { select: { id: true, duration: true } },
              training: { select: { id: true, name: true } },
            },
          },
        },
      },
    },
  });

  if (!inscription) {
    throw new NotFoundError(
      "Il n'existe aucun étudiant avec cette identifiant",
    );
  }

  if (inscription.status !== InscriptionStatus.SUBMITTED) {
    throw new ConflictError({}, "Ce dossier a déjà été traité");
  }

  const inscriptionUpdated = await prisma.inscription.update({
    where: { id: inscriptionId },
    data: { status: "REJECTED", ...data },
    select: {
      id: true,
      modality: true,
      waveId: true,
      status: true,
      studentId: true,
    },
  });

  await emailsService.sendMail({
    to: inscription.student.email,
    subject: "Response à votre inscription",
    react: RejectedInscriptionEmail({
      studentName: inscription.student.name,
      trainingName: `${inscription.wave.trainingProgram.training.name} durrée: ${inscription.wave.trainingProgram.program.duration} mois`,
      reasonRejected: data.reasonRejected ?? "",
    }),
  });

  return inscriptionUpdated;
}

export async function getInscriptionStatistics() {
  const [
    total,
    inscriptionAccepted,
    inscriptionRejected,
    inscriptionSubmitted,
  ] = await Promise.all([
    prisma.inscription.count(),
    prisma.inscription.count({ where: { status: "ACCEPTED" } }),
    prisma.inscription.count({ where: { status: "REJECTED" } }),
    prisma.inscription.count({ where: { status: "SUBMITTED" } }),
  ]);

  return {
    total,
    inscriptionAccepted,
    inscriptionRejected,
    inscriptionSubmitted,
  };
}

export async function sendConfirmationMail(
  programId: Identifier,
  student: FirstInscriptionResult,
  sendToAdmin = false,
) {
  const admin = await getAdmin();
  const trainingProgram = await getTrainingProgram(programId);
  const trainingProgramName = `${trainingProgram.training.name}  ${trainingProgram.program.duration} mois`;

  await Promise.all([
    sendToAdmin
      ? emailsService.sendMail({
          to: student.email,
          subject: "Soumission d'inscription",
          react: InscriptionConfirmationEmailToAdmin({
            studentEmail: student.email,
            studentName: student.name,
            studentPhone: student.phone,
            trainingName: trainingProgramName,
            submittedAt: student.inscriptions[0].createdAt.toDateString(),
            link: `${process.env.APP_URL}/admin/inscriptions/${student.inscriptions[0].id}`,
          }),
        })
      : undefined,
    emailsService.sendMail({
      to: admin.email,
      subject: `Soumission de candidature de ${student.name}  ${student.secondName}`,
      react: (
        await import("../../../emails/templates/InscriptionConfirmationEmailToStudent")
      ).default({
        trainingName: trainingProgramName,
        studentName: student.name,
        submittedAt: student.inscriptions[0].createdAt.toDateString(),
      }),
    }),
  ]);
}

export async function getSignature() {
  return {
    diploma: buildCloudinarySignature({ folder: folders.diploma }),
    studentPhoto: buildCloudinarySignature({ folder: folders.studentPhoto }),
    cniPassport: buildCloudinarySignature({ folder: folders.cniPassport }),
  };
}
