"use server";

import { paginationSchema } from "@/lib/pagination";
import * as trainingService from "./services";
import { fileInputSchema, identifierSchema } from "@/lib/zodRules";
import { actionClient, authActionClient } from "@/lib/safeAction";
import {
  addProgramInTrainingSchema,
  createTrainingSchema,
  updateTrainingProgramSchema,
  updateTrainingSchema,
} from "./schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import zod from "zod";
import {
  buildCloudinarySignature,
  getUrl,
} from "@/lib/StorageService/cloudinary/cloudinary-signer";
import { ALLOWED_MIME_TYPES_LIST_VALUE } from "@/lib/StorageService";

export const getTrainingListAction = actionClient
  .inputSchema(paginationSchema)
  .action(async ({ parsedInput: paginationParams }) => {
    const trainingList =
      await trainingService.getTrainingList(paginationParams);

    return trainingList;
  });

export const getTrainingProgramListAction = actionClient
  .bindArgsSchemas([identifierSchema.optional(), paginationSchema.optional()])
  .action(async ({ bindArgsClientInputs }) => {
    const [trainingId] = bindArgsClientInputs;
    const program = await trainingService.getTrainingProgramList(trainingId);

    return program;
  });

export const getTrainingProgramDetailsAction = actionClient
  .bindArgsSchemas([identifierSchema])
  .action(async ({ bindArgsClientInputs }) => {
    const [trainingProgramId] = bindArgsClientInputs;
    const program = await trainingService.getTrainingProgram(trainingProgramId);
    return program;
  });

export const createTrainingAction = authActionClient
  .inputSchema(createTrainingSchema)
  .action(async ({ parsedInput: data }) => {
    const result = await trainingService.createTraining(data);

    revalidatePath("/admin/training");
    revalidatePath("/trainings");
    redirect(`/admin/trainings/${result.id}`);
  });

export const updateTrainingAction = authActionClient
  .bindArgsSchemas([identifierSchema])
  .inputSchema(updateTrainingSchema)
  .action(async ({ parsedInput: data, bindArgsClientInputs }) => {
    const [trainingId] = bindArgsClientInputs;
    const training = await trainingService.updateTraining(trainingId, data);

    revalidatePath(`/admin/trainings/${training.id}`);
    revalidatePath("/admin/training-programs/[trainingProgramId]", "page");

    revalidatePath("/trainings/[trainingId]", "page");
    return training;
  });

export const getTrainingDetailsAction = actionClient
  .bindArgsSchemas([identifierSchema])
  .action(async ({ bindArgsParsedInputs }) => {
    const [trainingId] = bindArgsParsedInputs;
    return await trainingService.getTrainingDetails(trainingId);
  });

export const addProgramInTraining = authActionClient
  .bindArgsSchemas([identifierSchema])
  .inputSchema(addProgramInTrainingSchema)
  .action(async ({ parsedInput, bindArgsParsedInputs }) => {
    const [trainingId] = bindArgsParsedInputs;

    const trainingProgram = await trainingService.addProgramInTraining(
      trainingId,
      parsedInput,
    );

    // revalidatePath(`/admin/trainings/${trainingId}`);
    // revalidatePath("/admin/training-programs/[trainingProgramId]", "page");

    revalidatePath("/trainings/[trainingId]", "page");

    return trainingProgram;
    // redirect(`/admin/training-programs/${trainingProgram.id}`);
  });

export const getTopTrainingsAction = actionClient
  .bindArgsSchemas([zod.number().default(5)])
  .action(async ({ bindArgsParsedInputs }) => {
    const [limit] = bindArgsParsedInputs;
    const topTrainings = await trainingService.getTOpTrainings(limit);

    return topTrainings;
  });

export const updateTrainingProgramAction = authActionClient
  .inputSchema(updateTrainingProgramSchema)
  .bindArgsSchemas([identifierSchema])
  .action(async ({ bindArgsParsedInputs, parsedInput }) => {
    const [trainingProgramId] = bindArgsParsedInputs;
    const result = await trainingService.updateProgramTraining(
      trainingProgramId,
      parsedInput,
    );

    revalidatePath(`/trainings/${trainingProgramId}`);
    revalidatePath(`/admin/trainingProgram/${trainingProgramId}`);
    revalidatePath(`/admin/trainings/${result.trainingId}`);
    return result;
  });

export const getTrainingSignatureAction = authActionClient
  .inputSchema(fileInputSchema)
  .action(async () => {
    const signature = buildCloudinarySignature({ folder: "trainings" });

    return signature;
  });

export const getImageUrl = actionClient
  .inputSchema(
    zod.object({
      key: zod.string(),
      mimeType: zod.enum(ALLOWED_MIME_TYPES_LIST_VALUE),
    }),
  )
  .action(async ({ parsedInput }) => {
    return getUrl(parsedInput.key, parsedInput.mimeType);
  });
