import { Identifier } from "@/interfaces/entities";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPreRequestAction,
  deletePreRequestAction,
  getPreRequestListAction,
  updatePreRequestAction,
} from "./actions";
import { CreatePreRequestDTO, UpdatePreRequestDTO } from "./types";
import { unwrap } from "@/lib/safeAction";

const preRequestKey = {
  all: ["preRequests"] as const,
  trainingProgram: (trainingProgramId: Identifier) => [
    ...preRequestKey.all,
    trainingProgramId,
  ],
};

export function useGetPreRequestList(trainingProgramId: Identifier) {
  return useQuery({
    queryKey: preRequestKey.trainingProgram(trainingProgramId),
    queryFn: () => unwrap(getPreRequestListAction(trainingProgramId)),
  });
}

export function useMutationUpdatePreRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      preRequestId,
      ...data
    }: UpdatePreRequestDTO & { preRequestId: Identifier }) => {
      return await updatePreRequestAction(preRequestId, data);
    },
    onSuccess: (result) => {
      if (result.serverError || result.validationErrors || !result.data) {
        return;
      }
      const preRequest = result.data;
      queryClient.invalidateQueries({
        queryKey: preRequestKey.trainingProgram(preRequest.trainingProgramId),
      });
    },
  });
}

export function useMutationCreatePreRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreatePreRequestDTO) => {
      return await createPreRequestAction(data);
    },
    onSuccess: (result) => {
      if (result.serverError || result.validationErrors || !result.data) {
        return;
      }
      const preRequest = result.data;
      queryClient.invalidateQueries({
        queryKey: preRequestKey.trainingProgram(preRequest.trainingProgramId),
      });
    },
  });
}

export function useDeletePreRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (preRequestId: Identifier) => {
      const result = await deletePreRequestAction(preRequestId);

      return result;
    },

    onSuccess: (result) => {
      if (!result.data) {
        return;
      }
      queryClient.invalidateQueries({
        queryKey: preRequestKey.trainingProgram(result.data.trainingProgramId),
      });
    },
  });
}
