import { identifierSchema, numericInput } from "@/lib/zodRules";
import zod from "zod";
import { CreateWaveDTO, FilterWave, WaveStatus } from "./types";

const baseSchema = zod.object({
  startDate: zod.coerce.date({ error: "La date est requise" }),
  quota: numericInput("Le quota est requis", "Ce champ doit etre un nombre")
    .int({ error: "Le quota d'etudiant doit etre un entier" })
    .min(1, { error: "Le quota doit etre egale ou supérieure à 1" }),
});

export const createWaveSchema = baseSchema.extend({
  trainingProgramId: identifierSchema,
}) satisfies zod.ZodType<CreateWaveDTO>;

export const updateWaveSchema = baseSchema.partial();

export const filterWaveSchema = zod
  .object({
    trainingProgramId: zod.preprocess(
      (value) => (value === "" ? undefined : value),
      identifierSchema.optional(),
    ),
    programId: identifierSchema,
    trainingId: identifierSchema,
    status: zod.enum([
      WaveStatus.FINISHED,
      WaveStatus.OPEN,
      WaveStatus.PENDING,
    ]),
  })
  .partial() satisfies zod.ZodType<FilterWave>;
