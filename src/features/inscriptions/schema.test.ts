import { describe, expect, it } from "vitest";
import { ModalityOption } from "./types";
import {
  modalitySchema,
  formInscriptionByStudentInputSchema,
  verifyOtpCodeSchema,
  filterStudentSchema,
  studentFileInscriptionInput,
} from "./schemas";
import { lengthOtpCode } from "./constants";
import { createId } from "@paralleldrive/cuid2";

describe("modalitySchema", () => {
  it("accepts an online modality", () => {
    expect(modalitySchema.safeParse(ModalityOption.ON_LINE).success).toBe(true);
  });

  it("accepts an offline modality", () => {
    expect(modalitySchema.safeParse(ModalityOption.OFF_LINE).success).toBe(
      true,
    );
  });

  it("rejects an invalid modality", () => {
    const result = modalitySchema.safeParse("invalid");

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Modalité invalid");
    }
  });

  it("returns the required message when no modality is provided", () => {
    const result = modalitySchema.safeParse(undefined);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Choissez une modalité");
    }
  });

  it("returns the required message when the modality is empty", () => {
    const result = modalitySchema.safeParse("");

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Choissez une modalité");
    }
  });
});

describe("verifyOtpCodeSchema", () => {
  const validOtp = "1".repeat(lengthOtpCode);

  it("accepts a valid OTP code", () => {
    const result = verifyOtpCodeSchema.safeParse({
      otpCode: validOtp,
    });

    expect(result.success).toBe(true);
  });

  it("rejects an empty OTP code", () => {
    const result = verifyOtpCodeSchema.safeParse({
      otpCode: "",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Entrer le code otp");
    }
  });

  it("rejects an OTP code with an invalid length", () => {
    const result = verifyOtpCodeSchema.safeParse({
      otpCode: "1".repeat(lengthOtpCode - 1),
    });

    expect(result.success).toBe(false);
  });

  it("rejects an OTP code longer than the expected length", () => {
    const result = verifyOtpCodeSchema.safeParse({
      otpCode: "1".repeat(lengthOtpCode + 1),
    });

    expect(result.success).toBe(false);
  });

  it("rejects an OTP code containing non-numeric characters", () => {
    const result = verifyOtpCodeSchema.safeParse({
      otpCode: "1".repeat(lengthOtpCode - 1) + "a",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Doit contenir uniquement des chiffres",
      );
    }
  });
});

describe("formInscriptionByStudentInputSchema", () => {
  it("rejects an invalid OTP code", () => {
    const result = formInscriptionByStudentInputSchema.safeParse({
      otpCode: "123",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an OTP code containing letters", () => {
    const result = formInscriptionByStudentInputSchema.safeParse({
      otpCode: "12345a",
    });

    expect(result.success).toBe(false);
  });
});

describe("filterStudentSchema", () => {
  it("converts an empty waveId to undefined", () => {
    const result = filterStudentSchema.safeParse({
      waveId: "",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.waveId).toBeUndefined();
    }
  });

  it("keeps a valid waveId unchanged", () => {
    const waveId = createId();

    const result = filterStudentSchema.safeParse({
      waveId,
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.waveId).toBe(waveId);
    }
  });

  it("rejects an invalid waveId", () => {
    const result = filterStudentSchema.safeParse({
      waveId: "invalid-id",
    });

    expect(result.success).toBe(false);
  });
});

describe("studentFileInscriptionInput", () => {
  const validPdfFile = {
    mimeType: "application/pdf",
    filename: "diploma.pdf",
    size: 1000,
  };

  const validImageFile = {
    filename: "photo.jpg",
    size: 1000,
    mimeType: "image/jpeg",
  };

  it("accepts a valid PDF for the diploma", () => {
    const result = studentFileInscriptionInput.safeParse({
      diploma: validPdfFile,
      cniPassport: validPdfFile,
      photo: validImageFile,
    });

    expect(result.success).toBe(true);
  });

  it("accepts a valid PDF for the CNI or passport", () => {
    const result = studentFileInscriptionInput.safeParse({
      diploma: validPdfFile,
      cniPassport: {
        ...validPdfFile,
        name: "passport.pdf",
      },
      photo: validImageFile,
    });

    expect(result.success).toBe(true);
  });

  it("accepts a valid image for the photo", () => {
    const result = studentFileInscriptionInput.safeParse({
      diploma: validPdfFile,
      cniPassport: validPdfFile,
      photo: validImageFile,
    });

    expect(result.success).toBe(true);
  });

  it("rejects an image used as a diploma", () => {
    const result = studentFileInscriptionInput.safeParse({
      diploma: validImageFile,
      cniPassport: validPdfFile,
      photo: validImageFile,
    });

    expect(result.success).toBe(false);
  });

  it("rejects a PDF used as a photo", () => {
    const result = studentFileInscriptionInput.safeParse({
      diploma: validPdfFile,
      cniPassport: validPdfFile,
      photo: validPdfFile,
    });

    expect(result.success).toBe(false);
  });
});
