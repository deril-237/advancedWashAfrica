import { keepMount } from "better-auth/client";

// Provider Enum & File Interface
export const StorageProvider = {
  CLOUDINARY: "CLOUDINARY",
} as const;

export const ALLOWED_MIME_TYPES = {
  pdf: ["application/pdf"],
  image: ["image/jpeg", "image/jpeg", "image/png"],
  jpeg: ["image/jpeg"],
  png: ["image/png"],
  //   webp: ["image/webp"],
  //   doc: ["application/msword"],
  //   docx: [
  //     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  //   ],
} as const;

export const ALLOWED_MIME_TYPES_LIST_VALUE =
  Object.values(ALLOWED_MIME_TYPES).flat();
export type ALLOWED_MIME_TYPES_LIST =
  (typeof ALLOWED_MIME_TYPES_LIST_VALUE)[number];

export const ALLOWED_EXTENSIONS: Record<ALLOWED_MIME_TYPES_LIST, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpeg",
  "image/png": "png",
};

export type StorageProvider =
  (typeof StorageProvider)[keyof typeof StorageProvider];

export interface StoredFile {
  provider: StorageProvider;
  key: string;
  // url: string;
  originalName: string;
  mimeType: ALLOWED_MIME_TYPES_LIST;
  size: number;
}

export interface SignedUploadPayload {
  uploadUrl: string;
  uploadParams: Record<string, string | number>;
}

export type GetSignedUploadPayloadFn = (fileInfo: {
  filename: string;
  mimeType: string;
  size: number;
}) => Promise<SignedUploadPayload>;

export type StorageErrorCode =
  | "FILE_TOO_LARGE"
  | "INVALID_MIME_TYPE"
  | "PROVIDER_ERROR"
  | "NOT_FOUND"
  | "INVALID_KEY";

export class StorageError extends Error {
  code: StorageErrorCode;

  constructor(code: StorageErrorCode, message: string) {
    super(message);
    this.name = "StorageError";
    this.code = code;
  }
}

export interface StorageService {
  upload(
    file: File,
    params: SignedUploadPayload,
    onProgress?: (percent: number) => void,
  ): Promise<StoredFile>;

  delete(key: string): Promise<void>;
  getUrl(key: string): Promise<string>;
}
