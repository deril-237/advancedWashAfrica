import { beforeEach, describe, expect, it, vi } from "vitest";
import { InternalError } from "@/lib/errors/appError";
import { makePrismaError } from "@/test/mocks/prismaError";
import { prismaMock } from "@/test/mocks/prismaMock";
import { WaveStatus } from "./types";

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));

import { createWave } from "./services";
import { createId } from "@paralleldrive/cuid2";

const DAY_MS = 24 * 60 * 60 * 1000;

const trainingProgram = {
  id: createId(),
  price: 125_000,
  program: { id: createId(), duration: 7 },
};
const createWaveData = (startDate = new Date(Date.now() + 30 * DAY_MS)) => ({
  quota: 20,
  startDate,
  trainingProgramId: trainingProgram.id,
});

const lastWaveQuery = {
  orderBy: { startDate: "desc" },
  where: { trainingProgramId: trainingProgram.id },
};

const trainingProgramQuery = {
  where: { id: trainingProgram.id },
  select: {
    id: true,
    price: true,
    program: { select: { id: true, duration: true } },
  },
};

function mockCreateDependencies({
  lastWave = null,
  program = {
    id: trainingProgram.id,
    price: trainingProgram.price,
    duration: 7,
  },
}: {
  lastWave?: { status: string; startDate?: Date } | null;
  program?: { id: string; price: number; duration: number } | null;
} = {}) {
  prismaMock.wave.findFirst.mockResolvedValue(lastWave);
  prismaMock.trainingProgram.findUnique.mockResolvedValue(
    program === null
      ? null
      : {
          id: program.id,
          price: program.price,
          program: { id: createId(), duration: program.duration },
        },
  );
}

describe("createWave", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("creates a wave with the program price snapshot and OPEN status", async () => {
    const waveData = createWaveData();
    const createdWave = {
      id: createId(),
      ...waveData,
      price: trainingProgram.price,
      status: WaveStatus.OPEN,
    };
    mockCreateDependencies();
    prismaMock.wave.create.mockResolvedValue(createdWave);

    await expect(createWave(waveData)).resolves.toEqual(createdWave);

    expect(prismaMock.wave.findFirst).toHaveBeenCalledExactlyOnceWith(
      lastWaveQuery,
    );
    expect(
      prismaMock.trainingProgram.findUnique,
    ).toHaveBeenCalledExactlyOnceWith(trainingProgramQuery);
    expect(prismaMock.wave.create).toHaveBeenCalledExactlyOnceWith({
      data: {
        ...waveData,
        price: 125_000,
        status: WaveStatus.OPEN,
      },
    });
  });

  it("allows creating a wave after the previous wave has finished and its duration elapsed", async () => {
    const waveData = createWaveData();
    const finishedWaveStart = new Date(Date.now() - 10 * DAY_MS);
    mockCreateDependencies({
      lastWave: { status: WaveStatus.FINISHED, startDate: finishedWaveStart },
    });
    const waveNext = {
      id: createId(),
      ...waveData,
      price: trainingProgram.price,
      status: WaveStatus.OPEN,
    };
    prismaMock.wave.create.mockResolvedValue(waveNext);

    await expect(createWave(waveData)).resolves.toMatchObject({
      id: "wave-next",
    });

    expect(prismaMock.wave.create).toHaveBeenCalledExactlyOnceWith({
      data: {
        ...waveData,
        price: 125_000,
        status: WaveStatus.OPEN,
      },
    });
  });

  it.each([WaveStatus.OPEN, WaveStatus.PENDING])(
    "rejects when the latest wave is %s without looking up the program or creating a wave",
    async (status) => {
      mockCreateDependencies({ lastWave: { status } });

      await expect(createWave(createWaveData())).rejects.toMatchObject({
        code: "CONFLICT",
        global:
          "Il existe déja une vague avec des inscriptions en cours pour ce parcours de formation",
      });

      expect(prismaMock.wave.findFirst).toHaveBeenCalledWith(lastWaveQuery);
      expect(prismaMock.trainingProgram.findUnique).not.toHaveBeenCalled();
      expect(prismaMock.wave.create).not.toHaveBeenCalled();
    },
  );

  it("rejects a start date in the past and does not create a wave", async () => {
    mockCreateDependencies();
    const waveData = createWaveData(new Date(Date.now() - DAY_MS));

    await expect(createWave(waveData)).rejects.toMatchObject({
      code: "CONFLICT",
      fieldErrors: {
        startDate: ["La date de début doit être dans le futur"],
      },
    });

    expect(prismaMock.trainingProgram.findUnique).toHaveBeenCalledWith(
      trainingProgramQuery,
    );
    expect(prismaMock.wave.create).not.toHaveBeenCalled();
  });

  it("rejects a start date before the previous wave's duration has elapsed", async () => {
    const previousStartDate = new Date(Date.now() - DAY_MS);
    const requestedStartDate = new Date(Date.now() + DAY_MS);
    mockCreateDependencies({
      lastWave: {
        status: WaveStatus.FINISHED,
        startDate: previousStartDate,
      },
      program: { id: trainingProgram.id, price: 125_000, duration: 5 },
    });

    await expect(
      createWave(createWaveData(requestedStartDate)),
    ).rejects.toMatchObject({
      code: "CONFLICT",
      fieldErrors: {
        startDate: [
          "La date de début doit être après la date de fin de la vague précédente",
        ],
      },
    });

    expect(prismaMock.trainingProgram.findUnique).toHaveBeenCalledWith(
      trainingProgramQuery,
    );
    expect(prismaMock.wave.create).not.toHaveBeenCalled();
  });

  it("rejects when the training program does not exist", async () => {
    mockCreateDependencies({ program: null });

    await expect(createWave(createWaveData())).rejects.toMatchObject({
      code: "CONFLICT",
      fieldErrors: { trainingProgramId: ["Ce programme n'existe pas"] },
    });

    expect(prismaMock.trainingProgram.findUnique).toHaveBeenCalledWith(
      trainingProgramQuery,
    );
    expect(prismaMock.wave.create).not.toHaveBeenCalled();
  });

  it("maps a duplicate start date from persistence to a field conflict", async () => {
    mockCreateDependencies();
    prismaMock.wave.create.mockRejectedValue(
      makePrismaError("P2002", { target: ["startDate"] }),
    );

    await expect(createWave(createWaveData())).rejects.toMatchObject({
      code: "CONFLICT",
      fieldErrors: {
        startDate: ["Il existe une vague pour cette dans cette formation"],
      },
    });
  });

  it("maps a missing training program foreign key to a field conflict", async () => {
    mockCreateDependencies();
    prismaMock.wave.create.mockRejectedValue(
      makePrismaError("P2003", { field_name: "training_program_id" }),
    );

    await expect(createWave(createWaveData())).rejects.toMatchObject({
      code: "CONFLICT",
      fieldErrors: { trainingProgramId: ["Cette formation n'existe pas"] },
    });
  });

  it("maps unexpected persistence failures to an internal error", async () => {
    prismaMock.wave.findFirst.mockRejectedValue(new Error("database down"));

    await expect(createWave(createWaveData())).rejects.toBeInstanceOf(
      InternalError,
    );

    expect(prismaMock.trainingProgram.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.wave.create).not.toHaveBeenCalled();
  });
});
