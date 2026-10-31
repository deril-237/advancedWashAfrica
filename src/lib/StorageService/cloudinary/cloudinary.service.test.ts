import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CloudinaryStorageService } from "./cloudinary.service";
import { StorageError, StorageProvider } from "../interfaces";

describe("CloudinaryStorageService", () => {
  let service: CloudinaryStorageService;

  beforeEach(() => {
    service = new CloudinaryStorageService();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("upload", () => {
    it("uploads a file and returns the stored file information", async () => {
      const file = new File(["hello"], "document.pdf", {
        type: "application/pdf",
      });

      const xhr = createMockXHR({
        status: 200,
        responseText: JSON.stringify({
          public_id: "folder/document",
          secure_url: "https://cloudinary.com/document",
        }),
      });

      vi.stubGlobal("XMLHttpRequest", xhr.constructor);

      const result = await service.upload(file, {
        uploadUrl: "https://api.cloudinary.com/upload",
        uploadParams: {
          upload_preset: "my-preset",
          folder: "documents",
        },
      });

      expect(result).toEqual({
        provider: StorageProvider.CLOUDINARY,
        key: "folder/document",
        originalName: "document.pdf",
        mimeType: "application/pdf",
        size: file.size,
      });
    });

    it("sends the file and upload parameters", async () => {
      const file = new File(["hello"], "document.pdf", {
        type: "application/pdf",
      });

      const xhr = createMockXHR({
        status: 200,
        responseText: JSON.stringify({
          public_id: "documents/document",
        }),
      });

      vi.stubGlobal("XMLHttpRequest", xhr.constructor);

      await service.upload(file, {
        uploadUrl: "https://api.cloudinary.com/upload",
        uploadParams: {
          upload_preset: "my-preset",
          folder: "documents",
        },
      });

      expect(xhr.instance.open).toHaveBeenCalledWith(
        "POST",
        "https://api.cloudinary.com/upload",
      );

      expect(xhr.instance.send).toHaveBeenCalledTimes(1);

      const formData = xhr.instance.send.mock.calls[0][0];

      expect(formData).toBeInstanceOf(FormData);
      expect(formData.get("file")).toBe(file);
      expect(formData.get("upload_preset")).toBe("my-preset");
      expect(formData.get("folder")).toBe("documents");
    });

    it("reports upload progress", async () => {
      const file = new File(["hello"], "document.pdf", {
        type: "application/pdf",
      });

      const xhr = createMockXHR({
        status: 200,
        responseText: JSON.stringify({
          public_id: "documents/document",
        }),
      });

      vi.stubGlobal("XMLHttpRequest", xhr.constructor);

      const onProgress = vi.fn();

      const uploadPromise = service.upload(
        file,
        {
          uploadUrl: "https://api.cloudinary.com/upload",
          uploadParams: {},
        },
        onProgress,
      );

      // Simulate a browser upload progress event.
      xhr.instance.upload.onprogress?.({
        lengthComputable: true,
        loaded: 50,
        total: 100,
      } as ProgressEvent);

      xhr.instance.upload.onprogress?.({
        lengthComputable: true,
        loaded: 100,
        total: 100,
      } as ProgressEvent);

      xhr.instance.onload?.();

      await uploadPromise;

      expect(onProgress).toHaveBeenNthCalledWith(1, 50);
      expect(onProgress).toHaveBeenNthCalledWith(2, 100);
    });

    it("does not report progress when the total size cannot be computed", async () => {
      const file = new File(["hello"], "document.pdf", {
        type: "application/pdf",
      });

      const xhr = createMockXHR({
        status: 200,
        responseText: JSON.stringify({
          public_id: "documents/document",
        }),
      });

      vi.stubGlobal("XMLHttpRequest", xhr.constructor);

      const onProgress = vi.fn();

      const uploadPromise = service.upload(
        file,
        {
          uploadUrl: "https://api.cloudinary.com/upload",
          uploadParams: {},
        },
        onProgress,
      );

      xhr.instance.upload.onprogress?.({
        lengthComputable: false,
        loaded: 50,
        total: 100,
      } as ProgressEvent);

      xhr.instance.onload?.();

      await uploadPromise;

      expect(onProgress).not.toHaveBeenCalled();
    });

    it("throws a StorageError when the provider returns an HTTP error", async () => {
      const file = new File(["hello"], "document.pdf", {
        type: "application/pdf",
      });

      const xhr = createMockXHR({
        status: 400,
        responseText: "Bad request",
      });

      vi.stubGlobal("XMLHttpRequest", xhr.constructor);

      const promise = service.upload(file, {
        uploadUrl: "https://api.cloudinary.com/upload",
        uploadParams: {},
      });

      xhr.instance.onload?.();

      await expect(promise).rejects.toMatchObject({
        code: "PROVIDER_ERROR",
        message: "Upload failed with status 400",
      });
    });

    it("throws a StorageError when a network error occurs", async () => {
      const file = new File(["hello"], "document.pdf", {
        type: "application/pdf",
      });

      const xhr = createMockXHR({
        status: 0,
        responseText: "",
      });

      vi.stubGlobal("XMLHttpRequest", xhr.constructor);

      const promise = service.upload(file, {
        uploadUrl: "https://api.cloudinary.com/upload",
        uploadParams: {},
      });

      xhr.instance.onerror?.();

      await expect(promise).rejects.toMatchObject({
        code: "PROVIDER_ERROR",
        message: "Network error during upload",
      });
    });

    it("converts unexpected errors into a StorageError", async () => {
      const file = new File(["hello"], "document.pdf", {
        type: "application/pdf",
      });

      const xhr = createMockXHR({
        status: 200,
        responseText: "invalid-json",
      });

      vi.stubGlobal("XMLHttpRequest", xhr.constructor);

      const promise = service.upload(file, {
        uploadUrl: "https://api.cloudinary.com/upload",
        uploadParams: {},
      });

      xhr.instance.onload?.();

      await expect(promise).rejects.toBeInstanceOf(StorageError);
    });

    it("preserves an existing StorageError", async () => {
      const file = new File(["hello"], "document.pdf", {
        type: "application/pdf",
      });

      const xhr = createMockXHR({
        status: 500,
        responseText: "",
      });

      vi.stubGlobal("XMLHttpRequest", xhr.constructor);

      const promise = service.upload(file, {
        uploadUrl: "https://api.cloudinary.com/upload",
        uploadParams: {},
      });

      xhr.instance.onload?.();

      const error = await promise.catch((error) => error);

      expect(error).toBeInstanceOf(StorageError);
      expect(error.code).toBe("PROVIDER_ERROR");
      expect(error.message).toBe("Upload failed with status 500");
    });
  });

  describe("getUrl", () => {
    it("returns the Cloudinary URL for a file", async () => {
      const result = await service.getUrl("documents/my-file");

      expect(result).toBe(
        "https://res.cloudinary.com/votre_cloud/image/upload/documents/my-file",
      );
    });
  });
});

/**
 * Creates a controllable XMLHttpRequest mock.
 *
 * The test can manually trigger onload, onerror and onprogress
 * to simulate the browser's XMLHttpRequest lifecycle.
 */
function createMockXHR(options: { status: number; responseText: string }) {
  const instance = {
    status: options.status,
    responseText: options.responseText,

    upload: {
      onprogress: undefined as ((event: ProgressEvent) => void) | undefined,
    },

    open: vi.fn(),

    send: vi.fn(),

    onload: undefined as (() => void) | undefined,

    onerror: undefined as (() => void) | undefined,
  };

  class MockXMLHttpRequest {
    static instance = instance;

    status = instance.status;
    responseText = instance.responseText;
    upload = instance.upload;

    open = instance.open;
    send = instance.send;

    get onload() {
      return instance.onload;
    }

    set onload(value: (() => void) | undefined) {
      instance.onload = value;
    }

    get onerror() {
      return instance.onerror;
    }

    set onerror(value: (() => void) | undefined) {
      instance.onerror = value;
    }
  }

  return {
    constructor: MockXMLHttpRequest,
    instance,
  };
}
