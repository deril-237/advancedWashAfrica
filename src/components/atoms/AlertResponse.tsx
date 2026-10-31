import { Check, CircleAlert } from "lucide-react";

export function AlertResponse({
  message,
  type,
}: {
  message: string;
  type: "success" | "error";
}) {
  return (
    <>
      {type === "success" ? (
        <div className={`alert alert-soft alert-success`}>
          <Check />
          {message}
        </div>
      ) : (
        <div className={`alert alert-soft alert-error`}>
          <CircleAlert />
          {message}
        </div>
      )}
    </>
  );
}
