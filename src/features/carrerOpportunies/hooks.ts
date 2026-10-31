import { Identifier } from "@/interfaces/entities";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCarrerOpportunityAction,
  deleteCarrerOpportunityAction,
  getCarrerOpportunitiesAction,
  updateCarrerOpportunityAction,
} from "./actions";
import { CreateCarrerOpportunityDto, UpdateCarrerOpportunityDto } from "./types";
import { unwrap } from "@/lib/safeAction";

const carrerOpportunityKey = {
  all: ["carrerOpportunities"] as const,
  trainingProgram: (trainingProgramId: Identifier) => [
    ...carrerOpportunityKey.all,
    trainingProgramId,
  ],
};

export function useGetCarrerOpportunityList(trainingProgramId: Identifier) {
  return useQuery({
    queryKey: carrerOpportunityKey.trainingProgram(trainingProgramId),
    queryFn: () => unwrap(getCarrerOpportunitiesAction(trainingProgramId)),
  });
}

export function useMutationUpdateCarrerOpportunity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      carrerOpportunityId,
      ...data
    }: UpdateCarrerOpportunityDto & { carrerOpportunityId: Identifier }) => {
      return await updateCarrerOpportunityAction(carrerOpportunityId, data);
    },
    onSuccess: (result) => {
      if (result.serverError || result.validationErrors || !result.data) {
        return;
      }
      const carrerOpportunity = result.data;
      queryClient.invalidateQueries({
        queryKey: carrerOpportunityKey.trainingProgram(carrerOpportunity.trainingProgramId),
      });
    },
  });
}

export function useMutationCreateCarrerOpportunity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateCarrerOpportunityDto) => {
      return await createCarrerOpportunityAction(data);
    },
    onSuccess: (result) => {
      if (result.serverError || result.validationErrors || !result.data) {
        return;
      }
      const carrerOpportunity = result.data;
      queryClient.invalidateQueries({
        queryKey: carrerOpportunityKey.trainingProgram(carrerOpportunity.trainingProgramId),
      });
    },
  });
}

export function useDeleteCarrerOpportunity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (carrerOpportunityId: Identifier) => {
      const result = await deleteCarrerOpportunityAction(carrerOpportunityId);
      return result;
    },

    onSuccess: (result) => {
      if (!result.data) {
        return;
      }
      queryClient.invalidateQueries({
        queryKey: carrerOpportunityKey.trainingProgram(result.data.trainingProgramId),
      });
    },
  });
}
