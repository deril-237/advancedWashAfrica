import { type Module } from "@/lib/generated/prisma/client";
export { type Module } from "@/lib/generated/prisma/client";

export type CreateModuleDTO = Pick<
  Module,
  "name" | "description" | "trainingProgramId" | "position"
>;

export type UpdateModuleDTO = Partial<
  Pick<Module, "name" | "description" | "position">
>;
