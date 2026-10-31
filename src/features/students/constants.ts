import { Prisma } from "@/lib/generated/prisma/client";
import { minimalFileFields } from "../fileAssets";

export const folders = {
  diploma: "diploma",
  studentPhoto: "student-photo",
  cniPassport: "cni-passport",
};

export const motivation = {
  id: true,
  textResponse: true,
  option: {
    select: { label: true, id: true },
  },
} satisfies Prisma.StudentMotivationSelect;

export const selectStudentInformation = {
  id: true,
  name: true,
  secondName: true,
  phone: true,
  email: true,
  numCNIPassport: true,
};

export const selectDocuments = {
  diplomaFile: {
    select: minimalFileFields,
  },
  photoFile: {
    select: minimalFileFields,
  },
  cniPassportFile: {
    select: minimalFileFields,
  },
};
