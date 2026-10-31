import zod from "zod";
import { CreatePreRequestDTO, UpdatePreRequestDTO } from "./types";
import {
  identifierSchema,
  numericInput,
} from "@/lib/zodRules";

export const preRequestLabelSchema = zod
  .string()
  .trim()
  .min(2, "Le prérequis doit contenir au moins 2 caractères.")
  .max(255, "Le prérequis ne doit pas dépasser 255 caractères.");

export const createPreRequestSchema = zod.object({
  label: preRequestLabelSchema,
  order: numericInput()
    .int({
      error: "L'ordre du prérequis doit être un entier",
    })
    .min(1, { error: "L'ordre du prérequis doit être supérieur ou égal à 1" }),
  trainingProgramId: identifierSchema,
}) satisfies zod.ZodType<CreatePreRequestDTO>;

export const updatePreRequestSchema = zod
  .object({
    label: preRequestLabelSchema,
    order: numericInput()
      .int({
        error: "L'ordre du prérequis doit être un entier",
      })
      .min(1, {
        error: "L'ordre du prérequis doit être supérieur ou égal à 1",
      }),
  })
  .partial() satisfies zod.ZodType<UpdatePreRequestDTO>;
