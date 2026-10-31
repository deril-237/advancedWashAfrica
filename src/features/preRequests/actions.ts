"use server";

import { createPreRequestSchema, updatePreRequestSchema } from "./schemas";
import {
  createPreRequest,
  deletePreRequest,
  getPreRequestList,
  updatePreRequest,
} from "./services";
import { identifierSchema } from "@/lib/zodRules";
import { actionClient, authActionClient } from "@/lib/safeAction";
import { revalidatePath } from "next/cache";

export const createPreRequestAction = authActionClient
  .inputSchema(createPreRequestSchema)
  .action(async ({ parsedInput: data }) => {
    const preRequest = await createPreRequest(data);

    revalidatePath(`/admin/trainingProgram/${preRequest.trainingProgramId}`);
    return preRequest;
  });

export const updatePreRequestAction = authActionClient
  .bindArgsSchemas([identifierSchema])
  .inputSchema(updatePreRequestSchema)
  .action(async ({ parsedInput: data, bindArgsParsedInputs }) => {
    const [preRequestId] = bindArgsParsedInputs;
    const preRequest = await updatePreRequest(preRequestId, data);

    return preRequest;
  });

export const getPreRequestListAction = actionClient
  .bindArgsSchemas([identifierSchema])
  .action(async ({ bindArgsParsedInputs }) => {
    const [trainingProgramId] = bindArgsParsedInputs;
    const preRequestList = await getPreRequestList(trainingProgramId);

    return preRequestList;
  });

export const deletePreRequestAction = authActionClient
  .bindArgsSchemas([identifierSchema])
  .action(async ({ bindArgsParsedInputs }) => {
    const [preRequestId] = bindArgsParsedInputs;
    const preRequest = await deletePreRequest(preRequestId);

    return preRequest;
  });
