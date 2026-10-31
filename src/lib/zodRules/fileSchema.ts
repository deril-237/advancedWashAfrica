import z from "zod";
import { StorageProvider } from "@/lib/StorageService";
import { ALLOWED_MIME_TYPES_LIST_VALUE } from "../StorageService/interfaces";

const mineTypeSchema = z.enum(ALLOWED_MIME_TYPES_LIST_VALUE);

export const fileAssetSchema = z.object({
  provider: z.enum([StorageProvider.CLOUDINARY]),
  key: z.string().trim().min(1),
  // url: z.url(),
  originalName: z.string().trim().min(1).max(255),
  mimeType: mineTypeSchema,
  size: z.number().int().nonnegative(),
});

export const fileInputSchema = z.object({
  filename: z.string().min(1),
  mimeType: z.string(),
  size: z.number().positive().max(4000),
});
