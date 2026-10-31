import { type PaginationParams } from "@/lib/pagination";
import type { Identifier } from "@/interfaces/entities";
import da from "zod/v4/locales/da.cjs";

export const trainingKeys = {
  all: ["trainings"] as const,
  list: (params: PaginationParams) =>
    [...trainingKeys.all, "list", params] as const,
  details: (trainingId: Identifier) =>
    [...trainingKeys.all, "details", trainingId] as const,
  programs: (trainingId: Identifier) =>
    [...trainingKeys.all, "programs", trainingId] as const,
};
