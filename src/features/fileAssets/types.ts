import { FileAsset } from "@/lib/generated/prisma/client";
import { ALLOWED_MIME_TYPES_LIST } from "@/lib/StorageService";

export { type FileAsset, StorageProvider } from "@/lib/generated/prisma/client";
export type CreateFileAssetDTO = Omit<
  FileAsset,
  "id" | "createdAt" | "updatedAt" | "mimeType"
> & {
  mimeType: ALLOWED_MIME_TYPES_LIST;
};

export type UpdateFileAssetDTO = Pick<
  FileAsset,
  "id" | "createdAt" | "updatedAt"
>;

export type MinimalFileAsset = Pick<FileAsset, "id" | "key" | "mimeType">;
export type MinimalFileAssetSelect = { id: true; url: true };
