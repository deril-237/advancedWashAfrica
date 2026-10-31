import { Identifier } from "@/interfaces/entities";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createModuleAction,
  deleteModuleAction,
  getModuleListAction,
  updateModuleAction,
} from "./actions";
import { CreateModuleDTO, UpdateModuleDTO } from "./types";
import { useMessagePopup } from "@/store/useModalStore";
import { toast } from "react-toastify";
import { error } from "next/dist/build/output/log";
import { unwrap } from "@/lib/safeAction";

const moduleKey = {
  all: ["modules"] as const,
  trainingProgram: (trainingProgamId: Identifier) => [
    ...moduleKey.all,
    trainingProgamId,
  ],
};

export function useGetModuleList(trainingProgramId: Identifier) {
  return useQuery({
    queryKey: moduleKey.trainingProgram(trainingProgramId),
    queryFn: () => unwrap(getModuleListAction(trainingProgramId)),
  });
}

export function useMutationUpdateModule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      moduleId,
      ...data
    }: UpdateModuleDTO & { moduleId: Identifier }) => {
      return await updateModuleAction(moduleId, data);
    },
    onSuccess: (result) => {
      if (result.serverError || result.validationErrors || !result.data) {
        return;
      }
      const module = result.data;
      queryClient.invalidateQueries({
        queryKey: moduleKey.trainingProgram(module.trainingProgramId),
      });
    },
  });
}

export function useMutationCreateModule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateModuleDTO) => {
      return await createModuleAction(data);
    },
    onSuccess: (result) => {
      if (result.serverError || result.validationErrors || !result.data) {
        return;
      }
      const module = result.data;
      queryClient.invalidateQueries({
        queryKey: moduleKey.trainingProgram(module.trainingProgramId),
      });
    },
  });
}

export function useDeleteModule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (moduleId: Identifier) => {
      const result = await deleteModuleAction(moduleId);

      return result;
    },

    onSuccess: (result) => {
      if (!result.data) {
        return;
      }
      queryClient.invalidateQueries({
        queryKey: moduleKey.trainingProgram(result.data.trainingProgramId),
      });
    },
  });
}
