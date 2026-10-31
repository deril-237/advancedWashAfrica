"server-only";

import { v2 as cloudinary } from "cloudinary";
import {
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES_LIST,
  SignedUploadPayload,
} from "../interfaces";
import { config } from "./config";
import { getResourceType } from "./utils";

export type CloudinarySignParams = {
  timestamp: number;
  uploadPreset: string;
  folder?: string;
  publicId?: string;
};

export function buildCloudinarySignature({
  folder,
}: Pick<CloudinarySignParams, "folder">): SignedUploadPayload {
  const timestamp = Math.floor(Date.now() / 1000);
  const uploadPreset = config.uploadPreset;

  const paramsToSign: Record<string, any> = {
    timestamp,
    upload_preset: uploadPreset,
    type: "authenticated",
  };

  if (folder) paramsToSign.folder = folder;

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    config.apiSecret,
  );

  return {
    uploadUrl: `https://api.cloudinary.com/v1_1/${config.cloudName}/auto/upload`,
    uploadParams: {
      ...paramsToSign,
      signature,
      api_key: config.apiKey,
    },
  };
}

export function getUrl(
  publicId: string,
  mimeType: ALLOWED_MIME_TYPES_LIST,
  attachment = false,
) {
  try {
    const url = cloudinary.utils.private_download_url(
      publicId,
      ALLOWED_EXTENSIONS[mimeType],
      {
        resource_type: getResourceType(mimeType as ALLOWED_MIME_TYPES_LIST),
        type: "authenticated",
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        attachment: false,
      },
    );

    return url;
  } catch (error) {
    console.error(`url generation failed ${publicId}:`, error);

    throw error;
  }
}
