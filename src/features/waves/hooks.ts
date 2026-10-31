"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createWaveAction,
  getWaveStatisticAction,
  getWaveListAction,
  lockWaveCourseAction,
  unlockWaveCourseAction,
  updateWaveAction,
} from "./actions";
import { CreateWaveDTO, FilterWave, UpdateWaveDTO } from "./types";
import { Identifier } from "@/interfaces/entities";
import { unwrap } from "@/lib/safeAction";

export const waveKeys = {
  all: ["waves"] as const,
  list: (filter: FilterWave) => [...waveKeys.all, filter] as const,
  detail: (id: Identifier) => [...waveKeys.all, "detail", id] as const,
  stat: ["waves", "stat"] as const,
};

export function useUpdateWave(waveId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: UpdateWaveDTO) => updateWaveAction(waveId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: waveKeys.all });
      queryClient.invalidateQueries({ queryKey: waveKeys.detail(waveId) });
    },
  });
}

export function useCreateWave() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: CreateWaveDTO) => createWaveAction(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: waveKeys.all });
      queryClient.invalidateQueries({ queryKey: waveKeys.stat });
    },
  });
}

export function useGetWaveList(filter: FilterWave) {
  return useQuery({
    queryKey: waveKeys.list(filter),
    queryFn: async () => {
      const result = await unwrap(getWaveListAction(filter));

      return result;
    },
  });
}

export function useLockWaveCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (waveId: Identifier) => lockWaveCourseAction(waveId),
    onSuccess: (result) => {
      if (result.data) {
        queryClient.invalidateQueries({
          queryKey: waveKeys.all,
        });
        queryClient.invalidateQueries({
          queryKey: waveKeys.detail(result.data.id),
        });
      }
    },
  });
}

export function useUnlockWaveCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (waveId: Identifier) => unlockWaveCourseAction(waveId),
    onSuccess: (result) => {
      if (result.data) {
        queryClient.invalidateQueries({
          queryKey: waveKeys.all,
        });
        queryClient.invalidateQueries({
          queryKey: waveKeys.detail(result.data.id),
        });
      }
    },
  });
}

export function useGetStatistics() {
  return useQuery({
    queryKey: waveKeys.stat,
    queryFn: () => {
      return unwrap(getWaveStatisticAction());
    },
  });
}
