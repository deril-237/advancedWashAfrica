import zod from "zod";
import { emailSchema, identifierSchema, nameSchema } from "@/lib/zodRules";

export const contactsSchema = zod.object({
  name: nameSchema,
  email: emailSchema,
  subject: zod.string(),
  message: zod
    .string()
    .min(1, { error: "S'il,vous plait entrer votre message" }),
});

export const contactWithTrainingProgramSchema = zod.object({
  // name: nameSchema,
  email: emailSchema,
  message: zod
    .string()
    .min(1, { error: "S'il,vous plait entrer votre message" }),
});
