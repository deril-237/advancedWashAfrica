import { ReactNode } from "react";
import { MinimalFileAsset } from "../types";
import { getUrl } from "@/lib/StorageService/cloudinary/cloudinary-signer";
import { ALLOWED_MIME_TYPES_LIST } from "@/lib/StorageService";

export type ServerFileAssetProps = {
  render: (url: string) => ReactNode;
  fileAsset: MinimalFileAsset;
};
export function ServerFileAsset({ render, fileAsset }: ServerFileAssetProps) {
  const url = getUrl(
    fileAsset.key,
    fileAsset.mimeType as ALLOWED_MIME_TYPES_LIST,
  );

  return render(url);
}
