"use server";

import {
  createWaveSchema,
  filterWaveSchema,
  updateWaveSchema,
} from "./schemas";
import * as waveService from "./services";
import zod from "zod";
import { NotFoundError } from "@/lib/errors/appError";
import { identifierSchema, parseOrThrow } from "@/lib/zodRules";
import { authActionClient } from "@/lib/safeAction";
import { revalidatePath } from "next/cache";

export const createWaveAction = authActionClient
  .inputSchema(createWaveSchema)
  .action(async ({ parsedInput: formData }) => {
    const wave = await waveService.createWave(formData);
    revalidatePath("/waves");
    return wave;
  });

export const updateWaveAction = authActionClient
  .inputSchema(updateWaveSchema)
  .bindArgsSchemas([identifierSchema])
  .action(async ({ parsedInput: data, bindArgsParsedInputs }) => {
    const [id] = bindArgsParsedInputs;
    const result = await waveService.updateWave(id, data);
    revalidatePath("/waves");
    return result;
  });

export const getWaveListAction = authActionClient
  .inputSchema(filterWaveSchema)
  .action(async ({ parsedInput: filterWave }) => {
    const waveList = await waveService.getListWave(filterWave);

    return waveList;
  });

export const lockWaveCourseAction = authActionClient
  .bindArgsSchemas([identifierSchema])
  .action(async ({ bindArgsParsedInputs }) => {
    const [waveId] = bindArgsParsedInputs;
    return await waveService.lockWaveCourse(waveId);
  });

export const unlockWaveCourseAction = authActionClient
  .bindArgsSchemas([identifierSchema])
  .action(async ({ bindArgsParsedInputs }) => {
    const [waveId] = bindArgsParsedInputs;
    return await waveService.unlockWaveCourse(waveId);
  });

export const getWaveStatisticAction = authActionClient.action(
  waveService.getStatistics,
);
