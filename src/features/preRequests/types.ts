import { type PreRequest } from "@/lib/generated/prisma/client";
export { type PreRequest } from "@/lib/generated/prisma/client";

export type CreatePreRequestDTO = Pick<
  PreRequest,
  "label" | "order" | "trainingProgramId"
>;

export type UpdatePreRequestDTO = Partial<
  Pick<PreRequest, "label" | "order">
>;
