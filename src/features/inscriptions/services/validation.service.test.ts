import { createId } from "@paralleldrive/cuid2";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CodeError, NotFoundError } from "@/lib/errors/appError";
import { prismaMock } from "@/test/mocks/prismaMock";
import { checkNumCniOrPassportError } from "../errors";
import { checkNumCniPassportAndEmail, checkWave } from "./validation.service";

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));

describe("validation.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("checkNumCniPassportAndEmail", () => {
    it("resolves when no student matches the CNI or email", async () => {
      prismaMock.student.findFirst.mockResolvedValue(null);

      await expect(
        checkNumCniPassportAndEmail("GAAA-1234", "test@gmail.com"),
      ).resolves.toBeUndefined();
    });

    it("throws when a student already uses the CNI/passport", async () => {
      prismaMock.student.findFirst
        .mockResolvedValueOnce({ id: createId() })
        .mockResolvedValueOnce(null);

      await expect(
        checkNumCniPassportAndEmail("GAAA-1234", "test@gmail.com"),
      ).rejects.toMatchObject({
        code: CodeError.CONFLICT,
        fieldErrors: checkNumCniOrPassportError.cniOrPassport,
      });
    });

    it("throws when a student already uses the email", async () => {
      prismaMock.student.findFirst
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: createId() });

      await expect(
        checkNumCniPassportAndEmail("GAAA-1234", "test@gmail.com"),
      ).rejects.toMatchObject({
        code: CodeError.CONFLICT,
        fieldErrors: checkNumCniOrPassportError.email,
      });
    });
  });

  describe("checkWave", () => {
    it("throws when the wave is missing", async () => {
      prismaMock.wave.findFirst.mockResolvedValue(null);

      await expect(checkWave(createId())).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws when the wave quota is already reached", async () => {
      prismaMock.wave.findFirst.mockResolvedValue({
        id: createId(),
        quota: 10,
        _count: { inscriptions: 10 },
      });

      await expect(checkWave(createId())).rejects.toBeInstanceOf(NotFoundError);
    });

    it("returns the wave when capacity is available", async () => {
      const wave = {
        id: createId(),
        quota: 10,
        _count: { inscriptions: 9 },
      };
      prismaMock.wave.findFirst.mockResolvedValue(wave);

      await expect(checkWave(createId())).resolves.toMatchObject(wave);
    });
  });
});
