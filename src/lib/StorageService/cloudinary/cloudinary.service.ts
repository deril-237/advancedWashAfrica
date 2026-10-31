import {
  StorageService,
  StoredFile,
  StorageError,
  StorageProvider,
  SignedUploadPayload,
  ALLOWED_MIME_TYPES_LIST,
} from "./../interfaces";

export class CloudinaryStorageService implements StorageService {
  async upload(
    file: File,
    params: SignedUploadPayload,
    onProgress?: (percent: number) => void,
  ): Promise<StoredFile> {
    try {
      const { uploadUrl, uploadParams } = params;

      const formData = new FormData();
      formData.append("file", file);

      Object.entries(uploadParams).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      const responseText = await this.sendFile(uploadUrl, formData, onProgress);
      const data = JSON.parse(responseText);

      return {
        provider: StorageProvider.CLOUDINARY,
        key: data.public_id,
        // url: data.secure_url,
        originalName: file.name,
        mimeType: file.type as ALLOWED_MIME_TYPES_LIST,
        size: file.size,
      };
    } catch (err) {
      if (err instanceof StorageError) throw err;
      throw new StorageError("PROVIDER_ERROR", (err as Error).message);
    }
  }

  private async sendFile(
    uploadUrl: string,
    formData: FormData,
    onProgress?: (percent: number) => void,
  ): Promise<string> {
    const responseText = await new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", uploadUrl);

      if (onProgress && xhr.upload) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            onProgress(percent);
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.responseText);
        } else {
          reject(
            new StorageError(
              "PROVIDER_ERROR",
              `Upload failed with status ${xhr.status}`,
            ),
          );
        }
      };

      xhr.onerror = () =>
        reject(
          new StorageError("PROVIDER_ERROR", "Network error during upload"),
        );
      xhr.send(formData);
    });

    return responseText;
  }

  async delete(key: string): Promise<void> {}

  async getUrl(key: string): Promise<string> {
    return `https://res.cloudinary.com/votre_cloud/image/upload/${key}`;
  }
}

export const storageService = new CloudinaryStorageService();
