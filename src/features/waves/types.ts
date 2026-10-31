import { Identifier } from "@/interfaces/entities";
import { Prisma, Wave } from "@/lib/generated/prisma/client";

export { type Wave } from "@/lib/generated/prisma/client";

export const WaveStatus = {
  PENDING: "PENDING",
  FINISHED: "FINISHED",
  OPEN: "OPEN",
} as const;

export type WaveStatus = (typeof WaveStatus)[keyof typeof WaveStatus];

export type FilterWave = {
  trainingProgramId?: Identifier;
  trainingId?: Identifier;
  programId?: Identifier;
  status?: WaveStatus;
};

export type WaveItemList = Prisma.WaveGetPayload<{
  select: {
    id: true;
    startDate: true;
    quota: true;
    status: true;
    price: true;
    trainingProgramId: true;
    createdAt: true;
    updatedAt: true;
    trainingProgram: {
      select: {
        id: true;
        program: { select: { id: true; duration: true } };
        training: { select: { id: true; name: true } };
      };
    };
  };
}>;
// | Prisma.WaveGetPayload<{
//     select: {
//       id: true;
//       startDate: true;
//       quota: true;
//       status: true;
//       price: true;
//       trainingProgramId: true;
//       createdAt: true;
//       updatedAt: true;
//     };
//   }>;

export type WaveList = WaveItemList[];

export type CreateWaveDTO = Pick<
  Wave,
  "quota" | "startDate" | "trainingProgramId"
>;

export type UpdateWaveDTO = Partial<Omit<CreateWaveDTO, "trainingProgramId">>;
