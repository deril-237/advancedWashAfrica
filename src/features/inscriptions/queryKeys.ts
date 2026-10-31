import { FilterInscription } from "./types";
import { PaginationParams } from "@/lib/pagination";
import { FilterStudent } from "./types";

export const motivationOptionsKey = {
  all: ["motivationOptions"] as const,
};

export const inscriptionKeys = {
  all: ["inscriptions"] as const,
  statistics: ["inscriptions", "stat"] as const,
  lists: () => [...inscriptionKeys.all, "list"] as const,
  list: (params: PaginationParams, filter: FilterInscription) =>
    [...inscriptionKeys.lists(), params, filter] as const,
};
