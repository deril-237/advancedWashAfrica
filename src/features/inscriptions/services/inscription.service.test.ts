import { ConflictError, NotFoundError } from "@/lib/errors/appError";
import { StorageProvider } from "@/lib/generated/prisma/enums";
import { emailServiceMocked } from "@/test/mocks/email.mock";
import { prismaMock } from "@/test/mocks/prismaMock";
import { createId } from "@paralleldrive/cuid2";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { WaveStatus } from "../../waves/types";
import {
  InscriptionStatus,
  ModalityOption,
  StudentFirstInscriptionDTO,
} from "../types";
import {
  acceptInscription,
  firstStudentInscription,
  rejectInscription,
  secondStudentInscription,
} from "./inscription.service";
import { checkNumCniPassportAndEmail, checkWave } from "./validation.service";
import { prismaErrorCode } from "@/lib/errors/handlesError";
import { Prisma } from "@/lib/generated/prisma/client";

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));
vi.mock("@/lib/emails", () => ({ emailsService: emailServiceMocked }));
vi.mock("./validation.service", () => ({
  checkNumCniPassportAndEmail: vi.fn(),
  checkWave: vi.fn(),
}));

function makeInscription(): StudentFirstInscriptionDTO {
  return {
    trainingProgramId: createId(),
    modality: ModalityOption.OFF_LINE,
    name: "Student",
    secondName: "Name",
    birthDate: new Date("2000-01-01"),
    birthPlace: "Douala",
    numCNIPassport: "ABC123",
    email: "student@example.com",
    phone: "+237600000000",
    residence: "Yaounde",
    diploma: {
      provider: "CLOUDINARY",
      key: "diploma-key",
      originalName: "diploma.pdf",
      mimeType: "application/pdf",
      size: 1024,
    },
    photo: {
      provider: "CLOUDINARY",
      key: "photo-key",
      originalName: "photo.png",
      mimeType: "image/png",
      size: 1024,
    },
    cniPassport: {
      provider: "CLOUDINARY",
      key: "cni-key",
      originalName: "cni.png",
      mimeType: "image/png",
      size: 1024,
    },
  };
}

vi.mock("@/emails/templates/RejectedInscriptionEmail", () => ({
  RejectedInscriptionEmail: vi.fn(
    (props: {
      studentName: string;
      trainingName: string;
      reasonRejected?: string;
    }) => ({ type: "RejectedInscriptionEmail", props }),
  ),
}));

describe("inscription.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("firstStudentInscription", () => {
    it("rejects when the wave is unavailable", async () => {
      vi.mocked(checkWave).mockRejectedValueOnce(
        new NotFoundError("wave unavailable"),
      );
      vi.mocked(checkNumCniPassportAndEmail).mockResolvedValue(undefined);

      await expect(
        firstStudentInscription(makeInscription()),
      ).rejects.toBeInstanceOf(NotFoundError);

      expect(prismaMock.student.create).not.toHaveBeenCalled();
    });

    it("creates the student and the inscription when validation passes", async () => {
      const waveId = createId();
      const input: StudentFirstInscriptionDTO = makeInscription();
      vi.mocked(checkWave).mockResolvedValue({
        id: waveId,
        quota: 10,
        _count: { inscriptions: 1 },
      } as any);
      vi.mocked(checkNumCniPassportAndEmail).mockResolvedValue(undefined);
      prismaMock.student.create.mockResolvedValue({
        id: createId(),
        name: input.name,
        secondName: input.secondName,
        email: input.email,
        phone: input.phone,
        numCNIPassport: input.numCNIPassport,
        inscriptions: [{ id: createId(), createdAt: new Date() }],
      });

      await expect(firstStudentInscription(input)).resolves.toMatchObject({
        email: input.email,
      });

      expect(prismaMock.student.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email: input.email,
            numCNIPassport: input.numCNIPassport,
            inscriptions: {
              create: expect.objectContaining({
                waveId,
                status: InscriptionStatus.SUBMITTED,
              }),
            },
          }),
        }),
      );
    });

    it("rejects when the student already exists", async () => {
      const error = new ConflictError(
        { email: ["Cet email existe déjà"] },
        "Cet email existe déjà",
      );
      vi.mocked(checkNumCniPassportAndEmail).mockRejectedValue(error);

      await expect(
        firstStudentInscription(makeInscription()),
      ).rejects.toMatchObject(error);

      expect(prismaMock.student.create).not.toHaveBeenCalled();
    });
  });

  describe("secondStudentInscription", () => {
    it("creates a second inscription if the wave is valid", async () => {
      vi.mocked(checkWave).mockResolvedValue({
        id: createId(),
        quota: 10,
        _count: { inscriptions: 2 },
      } as any);

      const inscription = {
        id: createId(),
        studentId: createId(),
        waveId: createId(),
        status: InscriptionStatus.ACCEPTED,
        modality: ModalityOption.OFF_LINE,
      };

      prismaMock.inscription.create.mockResolvedValue(inscription);

      await expect(
        secondStudentInscription(createId(), {
          trainingProgramId: createId(),
          modality: ModalityOption.OFF_LINE,
        }),
      ).resolves.toEqual(inscription);
    });

    it("rejects when the wave is unavailable", async () => {
      vi.mocked(checkWave).mockRejectedValueOnce(
        new NotFoundError("wave unavailable"),
      );

      await expect(
        secondStudentInscription(createId(), {
          trainingProgramId: createId(),
          modality: ModalityOption.OFF_LINE,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);

      expect(prismaMock.inscription.create).not.toHaveBeenCalled();
    });

    it("rejects when the student already has an inscription for the wave", async () => {
      const waveId = createId();
      vi.mocked(checkWave).mockResolvedValue({
        id: waveId,
        quota: 10,
        _count: { inscriptions: 2 },
      } as any);

      prismaMock.inscription.create.mockRejectedValueOnce(
        new Prisma.PrismaClientKnownRequestError("", {
          code: prismaErrorCode.unique,
          clientVersion: "1.0.0",
        }),
      );

      await expect(
        secondStudentInscription(createId(), {
          trainingProgramId: createId(),
          modality: ModalityOption.OFF_LINE,
        }),
      ).rejects.toBeInstanceOf(ConflictError);

      expect(prismaMock.inscription.create).toHaveBeenCalled();
    });

    it("rejects when the student does not exist", async () => {
      const waveId = createId();
      vi.mocked(checkWave).mockResolvedValue({
        id: waveId,
        quota: 10,
        _count: { inscriptions: 2 },
      });

      prismaMock.inscription.create.mockRejectedValueOnce(
        new Prisma.PrismaClientKnownRequestError("", {
          code: prismaErrorCode.foreignKey,
          clientVersion: "1.0.0",
          meta: { field_name: "student_id" },
        }),
      );

      await expect(
        secondStudentInscription(createId(), {
          trainingProgramId: createId(),
          modality: ModalityOption.OFF_LINE,
        }),
      ).rejects.toBeInstanceOf(ConflictError);

      expect(prismaMock.inscription.create).toHaveBeenCalled();
    });
  });

  describe("acceptInscription", () => {
    it("throws when the inscription does not exist", async () => {
      prismaMock.inscription.findUnique.mockResolvedValue(null);

      await expect(acceptInscription(createId())).rejects.toBeInstanceOf(
        NotFoundError,
      );
      expect(prismaMock.inscription.update).not.toHaveBeenCalled();
    });

    it("throws when the inscription has already been processed", async () => {
      prismaMock.inscription.findUnique.mockResolvedValue({
        status: InscriptionStatus.ACCEPTED,
        student: { name: "A", secondName: "B", email: "a@b.com" },
        wave: {
          status: WaveStatus.OPEN,
          trainingProgram: {
            program: { duration: 3 },
            training: { name: "T" },
          },
        },
      });

      await expect(acceptInscription(createId())).rejects.toBeInstanceOf(
        ConflictError,
      );
    });

    it("accepts a submitted inscription and sends the email", async () => {
      const inscriptionId = createId();
      prismaMock.inscription.findUnique.mockResolvedValue({
        status: InscriptionStatus.SUBMITTED,
        student: { name: "A", secondName: "B", email: "a@b.com" },
        wave: {
          status: WaveStatus.OPEN,
          trainingProgram: {
            program: { duration: 3 },
            training: { name: "T" },
          },
        },
      } as any);
      prismaMock.inscription.update.mockResolvedValue({
        id: inscriptionId,
        waveId: createId(),
        studentId: createId(),
        status: InscriptionStatus.ACCEPTED,
        modality: ModalityOption.OFF_LINE,
      });

      await expect(acceptInscription(inscriptionId)).resolves.toMatchObject({
        status: InscriptionStatus.ACCEPTED,
      });
      expect(emailServiceMocked.sendMail).toHaveBeenCalled();
    });

    it("throws when the wave is finished", async () => {
      const inscriptionId = createId();
      prismaMock.inscription.findUnique.mockResolvedValue({
        status: InscriptionStatus.SUBMITTED,
        student: { name: "A", secondName: "B", email: "a@b.com" },
        wave: {
          status: WaveStatus.FINISHED,
          trainingProgram: {
            program: { duration: 3 },
            training: { name: "T" },
          },
        },
      });

      await expect(acceptInscription(inscriptionId)).rejects.toBeInstanceOf(
        ConflictError,
      );
    });
  });

  describe("rejectInscription", () => {
    it("throws when the inscription does not exist", async () => {
      prismaMock.inscription.findUnique.mockResolvedValue(null);

      await expect(acceptInscription(createId())).rejects.toBeInstanceOf(
        NotFoundError,
      );
      expect(prismaMock.inscription.update).not.toHaveBeenCalled();
    });

    it("throws when the inscription has already been processed", async () => {
      prismaMock.inscription.findUnique.mockResolvedValue({
        status: InscriptionStatus.ACCEPTED,
        student: { name: "A", secondName: "B", email: "a@b.com" },
        wave: {
          status: WaveStatus.OPEN,
          trainingProgram: {
            program: { duration: 3 },
            training: { name: "T" },
          },
        },
      });

      await expect(acceptInscription(createId())).rejects.toBeInstanceOf(
        ConflictError,
      );
    });

    it("throws when the wave is finished", async () => {
      const inscriptionId = createId();
      prismaMock.inscription.findUnique.mockResolvedValue({
        status: InscriptionStatus.SUBMITTED,
        student: { name: "A", secondName: "B", email: "a@b.com" },
        wave: {
          status: WaveStatus.FINISHED,
          trainingProgram: {
            program: { duration: 3 },
            training: { name: "T" },
          },
        },
      });

      await expect(acceptInscription(inscriptionId)).rejects.toBeInstanceOf(
        ConflictError,
      );
    });

    it("rejects a submitted inscription and sends an email", async () => {
      const inscriptionId = createId();
      prismaMock.inscription.findUnique.mockResolvedValue({
        status: InscriptionStatus.SUBMITTED,
        student: { name: "A", secondName: "B", email: "a@b.com" },
        wave: {
          status: WaveStatus.OPEN,
          trainingProgram: {
            program: { duration: 3 },
            training: { name: "T" },
          },
        },
      } as any);
      prismaMock.inscription.update.mockResolvedValue({
        id: inscriptionId,
        waveId: createId(),
        studentId: createId(),
        status: InscriptionStatus.REJECTED,
        modality: ModalityOption.OFF_LINE,
      });

      await expect(
        rejectInscription(inscriptionId, {
          reasonRejected: "Dossier incomplet",
        }),
      ).resolves.toMatchObject({ status: InscriptionStatus.REJECTED });

      expect(emailServiceMocked.sendMail).toHaveBeenCalled();
    });
  });
});
