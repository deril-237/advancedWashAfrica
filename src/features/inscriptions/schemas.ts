import {
  birthPlaceSchema,
  cniPassportSchema,
  dateSchema,
  emailSchema,
  fileAssetSchema,
  fileInputSchema,
  identifierSchema,
  imageSchema,
  nameSchema,
  pdfSchema,
  phoneSchema,
  residenceSchema,
} from "@/lib/zodRules";
import zod from "zod";
import {
  FilterInscription,
  FilterStudent,
  FirstInscriptionByStudentDTO,
  GetOtpCodeDTO,
  InscriptionStatus,
  ModalityOption,
  RejectInscriptionDTO,
  StudentFirstInscriptionDTO,
  StudentFirstInscriptionInput,
  StudentFirstInscriptionByStudentInput,
} from "./types";
import { lengthOtpCode } from "./constants";
import { ALLOWED_MIME_TYPES } from "@/lib/StorageService";

export const modalitySchema = zod.enum(
  [ModalityOption.OFF_LINE, ModalityOption.ON_LINE],
  {
    error: (issue) => {
      if (
        issue.input === "" ||
        issue.input === null ||
        issue.input === undefined
      ) {
        return "Choissez une modalité";
      }

      return "Modalité invalid";
    },
  },
);

const studentSchema = zod.object({
  numCNIPassport: cniPassportSchema,
  name: nameSchema,
  secondName: nameSchema,
  birthDate: dateSchema,
  birthPlace: birthPlaceSchema,
  email: emailSchema,
  phone: phoneSchema,
  residence: residenceSchema,
});

export const baseInscriptionSchema = studentSchema.extend({
  motivations: zod.array(zod.string()).optional(),
  otherMotivation: zod.string().trim().optional(),
  trainingProgramId: identifierSchema,
  modality: modalitySchema,
});

export const inscriptionSchema = baseInscriptionSchema.extend({
  diploma: fileAssetSchema,
  photo: fileAssetSchema,
  cniPassport: fileAssetSchema,
}) satisfies zod.ZodType<StudentFirstInscriptionDTO>;

export const formInscriptionSchema = baseInscriptionSchema.extend({
  diploma: pdfSchema,
  photo: imageSchema,
  cniPassport: pdfSchema,
  trainingId: identifierSchema.nonoptional({
    error: "selectionner un parcours",
  }),
}) satisfies zod.ZodType<StudentFirstInscriptionInput>;

export const formInscriptionByStudentInputSchema = formInscriptionSchema.extend(
  {
    otpCode: zod
      .string()
      .min(1, "Entrer le code otp")
      .regex(/^\d+$/, "Doit contenir uniquement des chiffres")
      .length(lengthOtpCode, "Completer le code"),
  },
) satisfies zod.ZodType<StudentFirstInscriptionByStudentInput>;

export const verifyOtpCodeSchema = zod.object({
  otpCode: zod
    .string()
    .nonempty("Entrer le code otp")
    .length(lengthOtpCode, "Code invalide")
    .regex(/^\d+$/, "Doit contenir uniquement des chiffres"),
  // .min(1, "Entrer le code otp")
}) satisfies zod.ZodType<{ otpCode: string }>;

export const formInscriptionByStudentSchema =
  inscriptionSchema satisfies zod.ZodType<FirstInscriptionByStudentDTO>;

export const checkNumCNIPassportSchema = studentSchema.pick({
  email: true,
  numCNIPassport: true,
});

export const secondInscriptionSchema = baseInscriptionSchema.pick({
  trainingProgramId: true,
  modality: true,
});

export const updateStudentInformationSchema = studentSchema.partial();

export const filterStudentSchema = zod
  .object({
    waveId: zod.preprocess(
      (value) => (value === "" ? undefined : value),
      identifierSchema.optional(),
    ),
    search: zod.string(),
  })
  .partial() satisfies zod.ZodType<FilterStudent>;

export const inscriptionFilterSchema = zod.object({
  status: zod
    .enum([
      InscriptionStatus.ACCEPTED,
      InscriptionStatus.REJECTED,
      InscriptionStatus.SUBMITTED,
    ])
    .optional(),
  search: zod.string().optional(),
  trainingProgramId: identifierSchema.optional(),
}) satisfies zod.ZodType<FilterInscription>;

export const rejectInscriptionSchema = zod.object({
  reasonRejected: zod.string(),
}) satisfies zod.ZodType<RejectInscriptionDTO>;

export const getOtpCodeSchema = zod.object({
  email: emailSchema,
  numCNIPassport: cniPassportSchema,
}) satisfies zod.ZodType<GetOtpCodeDTO>;

export const studentFileInscriptionInput = zod.object({
  diploma: fileInputSchema.extend({
    mimeType: zod.enum(ALLOWED_MIME_TYPES.pdf),
  }),
  cniPassport: fileInputSchema.extend({
    mimeType: zod.enum(ALLOWED_MIME_TYPES.pdf),
  }),
  photo: fileInputSchema.extend({
    mimeType: zod.enum(ALLOWED_MIME_TYPES.image),
  }),
});
