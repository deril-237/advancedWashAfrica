import zod from "zod";
import { CreateModuleDTO, UpdateModuleDTO } from "./types";
import {
  identifierSchema,
  moduleNameSchema,
  numericInput,
} from "@/lib/zodRules";

export const createModuleSchema = zod.object({
  name: moduleNameSchema,
  description: zod.string().min(1, { error: "Descrivez le module" }),
  position: numericInput()
    .int({
      error: "Le numero du module doit etre un entier",
    })
    .min(1, { error: "le numero du module doit etre superieure ou égale à 1" }),
  trainingProgramId: identifierSchema,
}) satisfies zod.ZodType<CreateModuleDTO>;

export const updateModuleSchema = zod
  .object({
    name: moduleNameSchema,
    description: zod.string().min(1, { error: "Descrivez le module" }),
    position: numericInput()
      .int({
        error: "Le numero du module doit etre un entier",
      })
      .min(1, {
        error: "le numero du module doit etre superieure ou égale à 1",
      }),
  })
  .partial() satisfies zod.ZodType<UpdateModuleDTO>;
