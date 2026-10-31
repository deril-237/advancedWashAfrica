import { Identifier } from "@/interfaces/entities";
import {
  Inscription,
  OptionMotivation,
  Prisma,
  Student,
  StudentMotivation,
} from "@/lib/generated/prisma/client";
import { CreateFileAssetDTO, MinimalFileAsset } from "../fileAssets";
import { PaginatedResult } from "@/lib/pagination";
import { Training } from "@/features/trainings";
import { Program } from "@/features/programs";

export { type Inscription } from "@/lib/generated/prisma/client";

export {
  type Student,
  type StudentMotivation,
  type OtpCode,
} from "@/lib/generated/prisma/client";

export const ModalityOption = {
  ON_LINE: "ON_LINE",
  OFF_LINE: "OFF_LINE",
} as const;

export const InscriptionStatus = {
  SUBMITTED: "SUBMITTED",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
} as const;

export type InscriptionStatus =
  (typeof InscriptionStatus)[keyof typeof InscriptionStatus];

export type ModalityOption =
  (typeof ModalityOption)[keyof typeof ModalityOption];

export type FilterStudent = { waveId?: Identifier; search?: string };

export type BaseStudent = Pick<
  Student,
  | "name"
  | "secondName"
  | "birthDate"
  | "birthPlace"
  | "numCNIPassport"
  | "email"
  | "phone"
  | "residence"
>;

export type CreateStudentDTO = BaseStudent & {
  diploma: CreateFileAssetDTO;
  photo: CreateFileAssetDTO;
  cniPassport: CreateFileAssetDTO;
};

export type CreateStudentInput = BaseStudent & {
  diploma: File;
  photo: File;
  cniPassport: File;
};

export type BaseFirstInscription = Pick<Inscription, "modality"> & {
  trainingProgramId: Identifier;
  motivations?: Identifier[];
  otherMotivation?: string;
};

export type StudentFirstInscriptionDTO = CreateStudentDTO &
  BaseFirstInscription;

export type FirstInscriptionByStudentDTO = StudentFirstInscriptionDTO;

export type StudentFirstInscriptionInput = CreateStudentInput &
  BaseFirstInscription & { trainingId: Identifier };

export type StudentFirstInscriptionByStudentInput =
  StudentFirstInscriptionInput & { otpCode: string };

export type VerifyOtpCodeDTO = { otpCode: string };

export type StudentSecondInscriptionDTO = Pick<
  BaseFirstInscription,
  "modality" | "trainingProgramId"
>;

export type StudentListItem = Pick<
  Student,
  "numCNIPassport" | "email" | "name" | "secondName" | "phone" | "id"
> & { photoFile: MinimalFileAsset };

export type StudentList = PaginatedResult<StudentListItem>;

export type UpdateStudentInformationDTO = Partial<BaseStudent>;

export type UpdateStudentDocument = {
  diploma?: CreateFileAssetDTO;
  photo?: CreateFileAssetDTO;
  cniPassport?: CreateFileAssetDTO;
};

export type FilterInscription = {
  trainingProgramId?: Identifier;
  search?: string;
  status?: InscriptionStatus;
};

export type RejectInscriptionDTO = Required<
  Pick<Inscription, "reasonRejected">
>;

export type InscriptionListItem = Pick<
  Inscription,
  "id" | "modality" | "status" | "createdAt"
> & {
  student: Pick<Student, "name" | "secondName"> & {
    photoFile?: MinimalFileAsset & { url: string };
  };
  wave: {
    trainingProgram: {
      training: Pick<Training, "name" | "id">;
      program: Pick<Program, "duration" | "id">;
    };
  };
};

export type InscriptionList = PaginatedResult<InscriptionListItem>;

export type StudentMotivations = (Pick<
  StudentMotivation,
  "id" | "textResponse"
> & {
  option: Pick<OptionMotivation, "label" | "id"> | null;
})[];

export type GetOtpCodeDTO = Pick<Student, "email" | "numCNIPassport">;

export type FirstInscriptionResult = Prisma.StudentGetPayload<{
  select: {
    id: true;
    name: true;
    secondName: true;
    email: true;
    phone: true;
    numCNIPassport: true;
    inscriptions: { select: { id: true; createdAt: true } };
  };
}>;
