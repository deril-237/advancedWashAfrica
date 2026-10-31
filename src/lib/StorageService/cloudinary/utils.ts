import { ALLOWED_MIME_TYPES_LIST } from "../interfaces";

export function getResourceType(mimeType: ALLOWED_MIME_TYPES_LIST) {
  if (mimeType === "application/pdf") {
    return "image";
  }

  return "image";
}
