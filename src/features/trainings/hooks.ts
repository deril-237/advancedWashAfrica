"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { FIRST_PAGE, PaginationParams } from "@/lib/pagination";
import {
  getTrainingListAction,
  getTrainingProgramListAction,
  updateTrainingAction,
  getTrainingDetailsAction,
  createTrainingAction,
  addProgramInTraining,
  getTrainingSignatureAction,
} from "./actions";
import type { Identifier } from "@/interfaces/entities";
import { unwrap } from "@/lib/safeAction";
import {
  AddProgramInTrainingDTO,
  CreateTrainingInput,
  UpdateTrainingInput,
} from "./types";
import { storageService } from "@/lib/StorageService/cloudinary/cloudinary.service";
import { CreateFileAssetDTO, FileAsset } from "@/features/fileAssets";
import { trainingKeys } from "./queryKeys";
import { Sign } from "crypto";

export function useGetTrainingList(page = FIRST_PAGE) {
  return useQuery({
    queryKey: trainingKeys.list({ page }),
    queryFn: async () => {
      const result = await unwrap(getTrainingListAction({ page }));

      return result;
    },
  });
}

export function useInfiniteGetTrainingList() {
  return useInfiniteQuery({
    queryKey: trainingKeys.all,
    queryFn: async ({ pageParam }) => {
      return await unwrap(getTrainingListAction({ page: pageParam }));
    },
    initialPageParam: FIRST_PAGE,
    getNextPageParam: (lastPage) => lastPage.meta.currentPage + 1,
    getPreviousPageParam: (lastPage) => lastPage.meta.currentPage - 1,
  });
}

export function useGetTrainingProgramList(
  trainingId: Identifier,
  pagination?: PaginationParams,
) {
  return useQuery({
    queryKey: trainingKeys.programs(trainingId),
    queryFn: async () => {
      const result = await unwrap(
        getTrainingProgramListAction(trainingId, pagination),
      );

      return result;
    },
    enabled: Boolean(trainingId),
  });
}

export function useUpdateTraining() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: UpdateTrainingInput & { trainingId: Identifier },
    ) => {
      const { trainingId, ...reset } = data;
      let image: CreateFileAssetDTO | undefined = undefined;

      if (reset.image) {
        const signature = await getTrainingSignatureAction({
          mimeType: reset.image.type,
          size: reset.image.size,
          filename: reset.image.name,
        });

        if (!signature.data) {
          throw new Error(`Erreur pendant l'obtention de la signature`);
        }
        image = await storageService.upload(reset.image, signature.data);
      }
      const result = await updateTrainingAction(trainingId, {
        ...reset,
        image,
      });

      if (result.data) {
        queryClient.invalidateQueries({ queryKey: trainingKeys.all });
        queryClient.invalidateQueries({
          queryKey: trainingKeys.details(trainingId),
        });
      }

      return result;
    },
  });
}

export function useGetTrainingDetails(trainingId: Identifier) {
  return useQuery({
    queryKey: trainingKeys.details(trainingId),
    queryFn: async () => {
      return await unwrap(getTrainingDetailsAction(trainingId));
    },
    enabled: Boolean(trainingId),
  });
}

export function useCreateTraining() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTrainingInput) => {
      const signature = await getTrainingSignatureAction({
        mimeType: data.image.type,
        size: data.image.size,
        filename: data.image.name,
      });

      if (!signature.data) {
        throw new Error(`Erreur pendant l'obtention de la signature`);
      }
      const image = await storageService.upload(data.image, signature.data);
      const result = await createTrainingAction({
        ...data,
        image,
      });

      if (!result.serverError && !result.validationErrors) {
        queryClient.invalidateQueries({ queryKey: trainingKeys.all });
      }

      return result;
    },
    onError: (error) => {
      console.log(error);
    },
  });
}

export function useAddProgramInTraining() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      trainingId,
      ...data
    }: AddProgramInTrainingDTO & { trainingId: Identifier }) => {
      const result = await addProgramInTraining(trainingId, data);

      if (result.data) {
        queryClient.invalidateQueries({ queryKey: trainingKeys.all });
      }

      return result;
    },
  });
}
