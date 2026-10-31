import { useMutation } from "@tanstack/react-query";
import { ChangePasswordDTO } from "./types";
import { changePasswordAction } from "./actions";

export function useChangePassword() {
  return useMutation({
    mutationFn: changePasswordAction,
  });
}
