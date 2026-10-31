"use server";

import {
  getStudentList,
  getStudentDetail,
  updateStudentInformation,
  getStudentStatistics,
} from "./services";
import { filterStudentSchema, updateStudentInformationSchema } from "./schemas";
import { identifierSchema } from "@/lib/zodRules";
import { paginationSchema } from "@/lib/pagination";
import { revalidatePath } from "next/cache";
import { authActionClient } from "@/lib/safeAction";

export const getStudentListAction = authActionClient
  .bindArgsSchemas([paginationSchema, filterStudentSchema])
  .action(async ({ bindArgsParsedInputs }) => {
    const [paginationParams, filter] = bindArgsParsedInputs;

    return await getStudentList(paginationParams, filter);
  });

export const getStudentDetailsAction = authActionClient
  .bindArgsSchemas([identifierSchema])
  .action(async ({ bindArgsParsedInputs }) => {
    const [studentId] = bindArgsParsedInputs;

    const student = await getStudentDetail(studentId);

    return student;
  });

export const updateStudentInfoAction = authActionClient
  .bindArgsSchemas([identifierSchema])
  .inputSchema(updateStudentInformationSchema)
  .action(async ({ parsedInput: data, bindArgsParsedInputs }) => {
    const [studentId] = bindArgsParsedInputs;

    const result = await updateStudentInformation(studentId, data);

    revalidatePath(`/admin/students/${studentId}`, "page");
    revalidatePath(`/admin/students`, "page");

    return result;
  });

export const getStudentStatisticsAction =
  authActionClient.action(getStudentStatistics);
