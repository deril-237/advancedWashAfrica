import { Identifier } from "@/interfaces/entities";

export type SignInDTO = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type VerifyEmailDTO = {
  email: string;
};

export type ResetPasswordInput = {
  password: string;
  confirmPassword: string;
};

export type ResetPasswordDTO = {
  newPassword: string;
  token: string;
};

export type ChangeEmailDTO = {
  newEmail: string;
  userId: Identifier;
};

export type ChangeEmailInput = Pick<ChangeEmailDTO, "newEmail">;
