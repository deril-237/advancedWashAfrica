import { vi } from "vitest";

const crudFn = {
  create: vi.fn(),
  findFirst: vi.fn(),
  findMany: vi.fn(),
  update: vi.fn(),
  findUnique: vi.fn(),
  delete: vi.fn(),
};

export const prismaMock = {
  program: crudFn,
  trainingProgram: {
    count: vi.fn(),
    findUnique: vi.fn(),
  },
  training: crudFn,
  inscription: crudFn,
  student: {
    create: vi.fn(),
    findFirst: vi.fn(),
  },
  user: {
    findUnique: vi.fn(),
  },
  wave: crudFn,
  otpCode: crudFn,
};
