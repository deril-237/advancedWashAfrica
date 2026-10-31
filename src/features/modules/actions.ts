"use server";

import { createModuleSchema, updateModuleSchema } from "./schemas";
import {
  createModule,
  deleteModule,
  getModuleList,
  updateModule,
} from "./services";
import { identifierSchema } from "@/lib/zodRules";
import { actionClient, authActionClient } from "@/lib/safeAction";
import { revalidatePath } from "next/cache";

export const createModuleAction = authActionClient
  .inputSchema(createModuleSchema)
  .action(async ({ parsedInput: data }) => {
    const module = await createModule(data);

    revalidatePath(`/admin/trainingProgram/${module.trainingProgramId}`);
    return module;
  });

export const updateModuleAction = authActionClient
  .bindArgsSchemas([identifierSchema])
  .inputSchema(updateModuleSchema)
  .action(async ({ parsedInput: data, bindArgsParsedInputs }) => {
    const [moduleId] = bindArgsParsedInputs;
    const module = await updateModule(moduleId, data);

    return module;
  });

export const getModuleListAction = actionClient
  .bindArgsSchemas([identifierSchema])
  .action(async ({ bindArgsParsedInputs }) => {
    const [trainingProgramId] = bindArgsParsedInputs;
    const moduleList = await getModuleList(trainingProgramId);

    return moduleList;
  });

export const deleteModuleAction = authActionClient
  .bindArgsSchemas([identifierSchema])
  .action(async ({ bindArgsParsedInputs }) => {
    const [moduleId] = bindArgsParsedInputs;
    const module = await deleteModule(moduleId);

    return module;
  });
