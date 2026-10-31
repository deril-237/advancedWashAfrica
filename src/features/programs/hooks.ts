"use client";

import { FIRST_PAGE, PaginationParams } from "@/lib/pagination";
import {
  createProgramAction,
  deleteProgramAction,
  getProgramListAction,
} from "./actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateProgramDTO, UpdateProgramDTO } from "./types";
import { unwrap } from "@/lib/safeAction";

export const programKeys = {
  all: ["programs"] as const,
  detail: (id: string) => [...programKeys.all, "detail", id] as const,
};

export function useCreateProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateProgramDTO) => {
      const result = await createProgramAction(data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programKeys.all });
    },
  });
}

// export function useMutationProgram(programId?: string) {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (data: UpdateProgramDTO) => {
//       if (programId) {
//         return await updateProgramAction(programId, data);
//       }
//       return await createProgramAction(data);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: programKeys.all });
//     },
//   });
// }

export function useGetProgramList(page = FIRST_PAGE) {
  return useQuery({
    queryKey: programKeys.all,
    queryFn: async () => {
      const result = await unwrap(getProgramListAction());

      return result;
    },
  });
}

export function useDeleteProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (programId: string) => {
      return await deleteProgramAction({ programId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programKeys.all });
    },
  });
}
