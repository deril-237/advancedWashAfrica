"use server";

import { createCarrerOpportunitySchema, updateCarrerOpportunitySchema } from "./schemas";
import {
  createCarrerOpportunity,
  deleteCarrerOpportunity,
  getCarrerOpportunities,
  updateCarrerOpportunity,
} from "./services";
import { identifierSchema } from "@/lib/zodRules";
import { actionClient, authActionClient } from "@/lib/safeAction";
import { revalidatePath } from "next/cache";

export const createCarrerOpportunityAction = authActionClient
  .inputSchema(createCarrerOpportunitySchema)
  .action(async ({ parsedInput: data }) => {
    const carrerOpportunity = await createCarrerOpportunity(data);

    if (carrerOpportunity) {
      revalidatePath(`/admin/trainingProgram/${carrerOpportunity.trainingProgramId}`);
    }
    return carrerOpportunity;
  });

export const updateCarrerOpportunityAction = authActionClient
  .bindArgsSchemas([identifierSchema])
  .inputSchema(updateCarrerOpportunitySchema)
  .action(async ({ parsedInput: data, bindArgsParsedInputs }) => {
    const [carrerOpportunityId] = bindArgsParsedInputs;
    const carrerOpportunity = await updateCarrerOpportunity(carrerOpportunityId, data);

    return carrerOpportunity;
  });

export const getCarrerOpportunitiesAction = actionClient
  .bindArgsSchemas([identifierSchema])
  .action(async ({ bindArgsParsedInputs }) => {
    const [trainingProgramId] = bindArgsParsedInputs;
    const list = await getCarrerOpportunities(trainingProgramId);

    return list;
  });

export const deleteCarrerOpportunityAction = authActionClient
  .bindArgsSchemas([identifierSchema])
  .action(async ({ bindArgsParsedInputs }) => {
    const [carrerOpportunityId] = bindArgsParsedInputs;
    const carrerOpportunity = await deleteCarrerOpportunity(carrerOpportunityId);

    return carrerOpportunity;
  });
