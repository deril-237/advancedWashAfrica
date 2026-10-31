import zod from "zod";
import { CreateProgramDTO } from "./types";

export const createProgramSchema = zod.object({
  duration: zod.coerce
    .number<number>()
    .int({ error: "La nombre de mois doit etre un entier" })
    .min(1, "Le nombre de mois doit etre positif"),
}) satisfies zod.ZodType<CreateProgramDTO>;

export const updateProgramSchema = createProgramSchema;
