"use server";

import { authActionClient } from "@/lib/safeAction";
import { changePasswordSchema } from "./schemas";
import { changePassword } from "./services";
import { headers } from "next/headers";

export const changePasswordAction = authActionClient
  .inputSchema(changePasswordSchema)
  .action(async ({ parsedInput }) => {
    await changePassword(parsedInput, await headers());
  });
