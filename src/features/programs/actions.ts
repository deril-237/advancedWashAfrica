"use server";

import { z } from "zod";

import { authActionClient } from "@/lib/safeAction";
import * as programsService from "./services";

import { createProgramSchema, updateProgramSchema } from "./schemas";

import { identifierSchema } from "@/lib/zodRules";
import { revalidatePath } from "next/cache";

export const createProgramAction = authActionClient
  .inputSchema(createProgramSchema)
  .action(async ({ parsedInput }) => {
    const program = await programsService.createProgram(parsedInput);
    revalidatePath("/admin/programs", "page");

    return program;
  });

// export const updateProgramAction = authActionClient
//   .inputSchema(updateProgramSchema)
//   .bindArgsSchemas([identifierSchema])
//   .action(async ({ parsedInput, bindArgsParsedInputs }) => {
//     const [programId] = bindArgsParsedInputs;

//     const program = await programsService.updateProgram(programId, parsedInput);
//     revalidatePath("/admin/programs", "page");

//     return program;
//   });

export const getProgramListAction = authActionClient.action(async () => {
  return programsService.getListProgram();
});

export const deleteProgramAction = authActionClient
  .inputSchema(
    z.object({
      programId: identifierSchema,
    }),
  )
  .action(async ({ parsedInput }) => {
    await programsService.deleteProgram(parsedInput.programId);
    revalidatePath("/admin/programs", "page");
  });
