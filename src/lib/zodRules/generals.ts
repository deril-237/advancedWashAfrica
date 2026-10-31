import { z } from "zod";
import { AppError } from "@/lib/errors/appError";
import zod from "zod";
import { MAX_LENGTH_PASSWORD, MIN_LENGTH_PASSWORD } from "@/constants";

export const nameRegex = /^[A-Za-zÀ-ÿ]+(?:[ '-][A-Za-zÀ-ÿ]+)*$/;
export const cniRegex = /^[A-Za-z0-9][A-Za-z0-9-]{3,}$/;
export const phoneRegex = /^\+?[0-9]{8,15}$/;
export const moduleRegex = /^[A-Za-zÀ-ÿ]+(?:[ '-][A-Za-z0-9À-ÿ]+)*$/;

export const moduleNameSchema = z
  .string()
  .trim()
  .min(2, "Ce champ doit contenir au moins 2 caractères.")
  .max(100, "Ce champ ne doit pas dépasser 100 caractères.")
  .regex(moduleRegex, "Format invalide.");

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Ce champ doit contenir au moins 2 caractères.")
  .max(100, "Ce champ ne doit pas dépasser 100 caractères.")
  .regex(nameRegex, "Format invalide.")
  .toLowerCase();

export const cniPassportSchema = z
  .string()
  .trim()
  .regex(cniRegex, "Numéro de CNI ou passeport invalide.");

export const birthPlaceSchema = z
  .string()
  .trim()
  .min(2, "Le lieu de naissance est requis.")
  .max(100, "Le lieu de naissance ne doit pas dépasser 100 caractères.")
  .regex(nameRegex, "Lieu de naissance invalide.");

export const residenceSchema = z
  .string()
  .trim()
  .min(2, "Le lieu de résidence est requis.")
  .max(150, "Le lieu de résidence ne doit pas dépasser 150 caractères.")
  .lowercase();

export const emailSchema = z
  .email("Adresse email invalide.")
  .trim()
  .lowercase();

export const phoneSchema = z
  .string()
  .trim()
  .min(8, { error: "le numero de téléĥone doit avoir  au moins 8 chiffres" })
  .max(15, { error: "Le numeor de téléphone doit avoir au plus 15 chiffres" })
  .regex(phoneRegex, "Numéro de téléphone ne doit avoir que des chiffres");

export const pdfSchema = z
  .file()
  .mime("application/pdf", "Le fichier doit être un document PDF.")
  .max(4 * 1024 * 1024, "Le fichier ne doit pas dépasser 4 Mo.");

export const imageSchema = z
  .file()
  .mime(["image/jpeg", "image/png"], "La photo doit être au format JPG ou PNG.")
  .max(4 * 1024 * 1024, "La photo ne doit pas dépasser 4 Mo.");

export const dateSchema = z.coerce.date<Date>({
  error: (issue) => {
    if (
      issue.input === "" ||
      issue.input === undefined ||
      issue.input === null
    ) {
      return "La date est requise.";
    }

    return "Date invalide.";
  },
});

export const passwordSchema = zod
  .string()
  .min(MIN_LENGTH_PASSWORD, {
    error: `Le mot doit avoir ${MIN_LENGTH_PASSWORD} caractères minimun`,
  })
  .max(MAX_LENGTH_PASSWORD, {
    error: `Le mot de pas doit avoir plus de ${MAX_LENGTH_PASSWORD} `,
  });

export const identifierSchema = z.cuid2({
  error: (issue) => {
    if (
      issue.input === undefined ||
      issue.input === null ||
      issue.input === ""
    ) {
      return "Ce Champ requis";
    }

    return "Indentifiant invalid";
  },
});

export const numericInput = (required?: string, invalid?: string) =>
  z.coerce.number<number>({
    error: (error) => {
      if (
        error.input === "" ||
        error.input === undefined ||
        error.input === null
      ) {
        return required;
      }

      return invalid;
    },
  });

export const dateInput = (
  requiredMessage: string,
  invalidMessage = "Veuillez entrer une date valide",
) => zod.coerce.date;

export const optionalDateInput = (
  invalidMessage = "Veuillez entrer une date valide",
) =>
  z.preprocess(
    (value) => {
      if (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "")
      ) {
        return undefined;
      }

      return value;
    },
    z
      .string({
        error: invalidMessage,
      })
      .transform((value, ctx) => {
        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
          ctx.addIssue({
            code: "custom",
            message: invalidMessage,
          });

          return z.NEVER;
        }

        return date;
      }),
  );

export function parseOrThrow<T>(
  schema: z.ZodType<T>,
  value: unknown,
  createError: () => AppError,
): T {
  const result = schema.safeParse(value);

  if (!result.success) {
    throw createError();
  }

  return result.data;
}
