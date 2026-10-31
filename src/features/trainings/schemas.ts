import zod from "zod";
import {
  AddProgramInTrainingDTO,
  CreateTrainingDTO,
  CreateTrainingInput,
  UpdateTrainingDTO,
  UpdateTrainingInput,
  UpdateTrainingProgramDTO,
} from "./types";
import {
  fileAssetSchema,
  identifierSchema,
  imageSchema,
  nameSchema,
  numericInput,
} from "@/lib/zodRules";

export const createTrainingSchema = zod.object({
  name: nameSchema,
  description: zod.string(),
  objective: zod.string(),
  image: fileAssetSchema,
}) satisfies zod.ZodType<CreateTrainingDTO>;

export const createTrainingInputSchema = zod.object({
  name: nameSchema,
  description: zod.string(),
  objective: zod.string(),
  image: imageSchema,
}) satisfies zod.ZodType<CreateTrainingInput>;

export const updateTrainingSchema = zod
  .object({
    name: nameSchema,
    description: zod.string(),
    objective: zod.string(),
    image: fileAssetSchema,
    programs: zod.array(identifierSchema),
  })
  .partial() satisfies zod.ZodType<UpdateTrainingDTO>;

export const updateTrainingInputSchema = zod
  .object({
    name: nameSchema,
    description: zod.string(),
    objective: zod.string(),
    image: imageSchema,
    programs: zod.array(identifierSchema),
  })
  .partial() satisfies zod.ZodType<UpdateTrainingInput>;

export const addProgramInTrainingSchema = zod.object({
  price: numericInput()
    .int({ error: "Le prix d'une formation doit etre un entier" })
    .positive({ error: "Le prix doit etre un nombre positif" }),
  programId: identifierSchema,
}) satisfies zod.ZodType<AddProgramInTrainingDTO>;

export const updateTrainingProgramSchema = zod.object({
  price: numericInput()
    .int({ error: "Le prix d'une formation doit etre un entier" })
    .positive({ error: "Le prix doit etre un nombre positif" }),
}) satisfies zod.ZodType<UpdateTrainingProgramDTO>;
