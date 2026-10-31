import { Program } from "@/lib/generated/prisma/client";
export { type Program } from "@/lib/generated/prisma/client";

export type CreateProgramDTO = Pick<Program, "duration">;
export type UpdateProgramDTO = CreateProgramDTO;
