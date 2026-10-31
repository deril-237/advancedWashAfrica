import { PaginationParams } from "@/lib/pagination";
import { FilterStudent } from "./types";

export const studentKeys = {
  all: ["students"] as const,
  statistics: ["students", "stat"] as const,
  lists: () => [...studentKeys.all, "list"] as const,

  list: (params: PaginationParams, filter: FilterStudent) =>
    [...studentKeys.lists(), params, filter] as const,
};
