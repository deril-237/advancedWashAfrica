import {
  birthPlaceSchema,
  cniPassportSchema,
  dateSchema,
  emailSchema,
  identifierSchema,
  nameSchema,
  phoneSchema,
  residenceSchema,
} from "@/lib/zodRules";
import zod from "zod";
import { FilterStudent } from "./types";

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

export const checkNumCNIPassportSchema = studentSchema.pick({
  email: true,
  numCNIPassport: true,
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
