"server-only";
import { v2 as cloudinary } from "cloudinary";

export const config = {
  apiKey: process.env.CLOUDINARY_API_KEY as string,
  apiSecret: process.env.CLOUDINARY_API_SECRET as string,
  cloudName: process.env.CLOUDINARY_CLOUD_NAME as string,
  uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET as string,
};

cloudinary.config({
  api_key: config.apiKey,
  api_secret: config.apiSecret,
  cloud_name: config.cloudName,
  secure: true,
});
