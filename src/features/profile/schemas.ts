import zod from "zod";
import { ChangePasswordDTO } from "./types";
import { passwordSchema } from "@/lib/zodRules";

export const changePasswordSchema = zod.object({
  newPassword: passwordSchema,
  currentPassword: zod.string(),
}) satisfies zod.ZodType<ChangePasswordDTO>;
