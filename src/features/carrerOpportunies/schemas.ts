import zod from "zod";
import { CreateCarrerOpportunityDto, UpdateCarrerOpportunityDto } from "./types";
import { identifierSchema } from "@/lib/zodRules";

export const carrerOpportunityLabelSchema = zod
  .string()
  .trim()
  .min(2, "Le nom de l'opportunité doit contenir au moins 2 caractères.")
  .max(255, "Le nom de l'opportunité ne doit pas dépasser 255 caractères.");

export const createCarrerOpportunitySchema = zod.object({
  label: carrerOpportunityLabelSchema,
  trainingProgramId: identifierSchema,
}) satisfies zod.ZodType<CreateCarrerOpportunityDto>;

export const updateCarrerOpportunitySchema = zod
  .object({
    label: carrerOpportunityLabelSchema,
  }) satisfies zod.ZodType<UpdateCarrerOpportunityDto>;
