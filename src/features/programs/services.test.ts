import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  ConflictError,
  InternalError,
  NotFoundError,
} from "@/lib/errors/appError";
import { makePrismaError } from "@/test/mocks/prismaError";
import { prismaMock } from "@/test/mocks/prismaMock";

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));

import {
  createProgram,
  deleteProgram,
  getListProgram,
  updateProgram,
} from "./services";

describe("programs services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createProgram", () => {
    it("creates and returns a program", async () => {
      const program = { id: "program-1", duration: 12 };
      prismaMock.program.create.mockResolvedValue(program);

      await expect(createProgram({ duration: 12 })).resolves.toEqual(program);
      expect(prismaMock.program.create).toHaveBeenCalledWith({
        data: { duration: 12 },
      });
    });

    it("maps an unexpected persistence error to an internal error", async () => {
      prismaMock.program.create.mockRejectedValue(new Error("database down"));

      await expect(createProgram({ duration: 12 })).rejects.toMatchObject({
        code: "INTERNAL_ERROR",
      });
    });

    it("maps a duplicate duration to a conflict with a field message", async () => {
      prismaMock.program.create.mockRejectedValue(
        makePrismaError("P2002", { target: ["duration"] }),
      );

      await expect(createProgram({ duration: 12 })).rejects.toMatchObject({
        code: "CONFLICT",
        global: "un parcours avec cette durée existe déja",
        fieldErrors: {
          duration: ["un parcours avec cette durée existe déja"],
        },
      });
    });
  });

  describe("updateProgram", () => {
    it("updates a program by identifier", async () => {
      const program = { id: "program-1", duration: 24 };
      prismaMock.program.update.mockResolvedValue(program);

      await expect(
        updateProgram("program-1", { duration: 24 }),
      ).resolves.toEqual(program);
      expect(prismaMock.program.update).toHaveBeenCalledWith({
        where: { id: "program-1" },
        data: { duration: 24 },
      });
    });

    it("maps a duplicate duration to a conflict", async () => {
      prismaMock.program.update.mockRejectedValue(
        makePrismaError("P2002", { target: ["duration"] }),
      );

      await expect(
        updateProgram("program-1", { duration: 24 }),
      ).rejects.toMatchObject({
        code: "CONFLICT",
        global: "un parcours avec cette durée existe déja",
      });
    });

    it("maps a missing program to a not-found error", async () => {
      prismaMock.program.update.mockRejectedValue(makePrismaError("P2025"));

      await expect(
        updateProgram("missing-program", { duration: 24 }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("maps an unexpected persistence error to an internal error", async () => {
      prismaMock.program.update.mockRejectedValue(new Error("database down"));

      await expect(
        updateProgram("program-1", { duration: 24 }),
      ).rejects.toBeInstanceOf(InternalError);
    });
  });

  describe("getListProgram", () => {
    it("returns all programs", async () => {
      const programs = [
        { id: "program-1", duration: 12 },
        { id: "program-2", duration: 24 },
      ];
      prismaMock.program.findMany.mockResolvedValue(programs);

      await expect(getListProgram()).resolves.toEqual(programs);
      expect(prismaMock.program.findMany).toHaveBeenCalledWith();
    });

    it("propagates a list query failure", async () => {
      const error = new Error("database down");
      prismaMock.program.findMany.mockRejectedValue(error);

      await expect(getListProgram()).rejects.toBe(error);
    });
  });

  describe("deleteProgram", () => {
    it("refuses deletion when the program is associated with trainings", async () => {
      prismaMock.trainingProgram.count.mockResolvedValue(1);

      await expect(deleteProgram("program-1")).rejects.toBeInstanceOf(
        ConflictError,
      );
      expect(prismaMock.trainingProgram.count).toHaveBeenCalledWith({
        where: { programId: "program-1" },
      });
      expect(prismaMock.program.delete).not.toHaveBeenCalled();
    });

    it("deletes an unused program", async () => {
      const program = { id: "program-1", duration: 12 };
      prismaMock.trainingProgram.count.mockResolvedValue(0);
      prismaMock.program.delete.mockResolvedValue(program);

      await expect(deleteProgram("program-1")).resolves.toEqual(program);
      expect(prismaMock.trainingProgram.count).toHaveBeenCalledWith({
        where: { programId: "program-1" },
      });
      expect(prismaMock.program.delete).toHaveBeenCalledWith({
        where: { id: "program-1" },
      });
    });

    it("maps a missing program to a not-found error", async () => {
      prismaMock.trainingProgram.count.mockResolvedValue(0);
      prismaMock.program.delete.mockRejectedValue(makePrismaError("P2025"));

      await expect(deleteProgram("missing-program")).rejects.toBeInstanceOf(
        NotFoundError,
      );
    });
  });
});
