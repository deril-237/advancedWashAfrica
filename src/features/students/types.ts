import { Identifier } from "@/interfaces/entities";
import {
  Inscription,
  OptionMotivation,
  Prisma,
  Student,
  StudentMotivation,
} from "@/lib/generated/prisma/client";
import {
  CreateFileAssetDTO,
  FileAsset,
  MinimalFileAsset,
  MinimalFileAssetSelect,
} from "../fileAssets";
import { PaginatedResult } from "@/lib/pagination";
import { Training } from "@/features/trainings";
import { Program } from "@/features/programs";

export {
  type Student,
  type StudentMotivation,
} from "@/lib/generated/prisma/client";

export const InscriptionStatus = {
  SUBMITTED: "SUBMITTED",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
} as const;

export type InscriptionStatus =
  (typeof InscriptionStatus)[keyof typeof InscriptionStatus];

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

export type StudentListItem = Pick<
  Student,
  "numCNIPassport" | "email" | "name" | "secondName" | "phone" | "id"
> & { photoFile: MinimalFileAsset & { url: string } };

export type StudentList = PaginatedResult<StudentListItem>;

export type UpdateStudentInformationDTO = Partial<BaseStudent>;

export type UpdateStudentDocument = {
  diploma?: CreateFileAssetDTO;
  photo?: CreateFileAssetDTO;
  cniPassport?: CreateFileAssetDTO;
};

export type StudentProfile = Prisma.StudentGetPayload<{
  include: {
    diplomaFile: { select: MinimalFileAssetSelect };
    photoFile: { select: MinimalFileAssetSelect };
    cniPassportFile: { select: MinimalFileAssetSelect };
    motivations: {
      select: {
        id: true;
        textResponse: true;
        option: {
          select: { id: true; label: true };
        };
      };
    };
    inscriptions: {
      select: {
        id: true;
        modality: true;
        reasonRejected: true;
        status: true;
        waveId: true;
        wave: {
          select: {
            id: true;
            trainingProgramId: true;
            trainingProgram: {
              select: {
                id: true;
                program: {
                  select: {
                    id: true;
                    duration: true;
                  };
                };
                training: {
                  select: {
                    id: true;
                    name: true;
                  };
                };
              };
            };
          };
        };
      };
    };
  };
}>;
