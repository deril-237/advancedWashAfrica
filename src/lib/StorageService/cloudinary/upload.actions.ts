"use server";

import { authActionClient } from "@/lib/safeAction";
import { v2 as cloudinary } from "cloudinary";
import zod from "zod";
import { config } from "./config";

export interface SignedUploadPayload {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  publicId: string;
  uploadPrest: string;
}

cloudinary.config({
  cloud_name: config.cloudName,
  api_key: config.apiSecret,
  api_secret: config.apiSecret,
});

export const getCloudinarySignedPayload = authActionClient.action(async () => {
  const timestamp = Math.floor(Date.now() / 1000);
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET!;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, upload_preset: uploadPreset },
    process.env.CLOUDINARY_API_SECRET!,
  );

  return {
    uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    uploadParams: {
      signature,
      timestamp,
      api_key: process.env.CLOUDINARY_API_KEY!,
      upload_preset: uploadPreset,
    },
  };
});
