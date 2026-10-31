"use client";

import { useFormContext } from "react-hook-form";
import { type StudentFirstInscriptionByStudentInput } from "../../types";
import {
  FunctionComponent,
  useRef,
  ClipboardEvent,
  KeyboardEvent,
  ChangeEvent,
} from "react";
import { lengthOtpCode } from "../../constants";
import { getOtpCodeAction } from "../../actions";
import { toast } from "react-toastify";
import { useContextCounter } from "@/providers/CounterProvider";
import { formatWaitTime } from "@/lib/utils";

export const Step4CheckOTPCode: FunctionComponent = () => {
  const {
    formState: { errors },
    setValue,
    watch,
    getValues,
    trigger,
    setError,
  } = useFormContext<StudentFirstInscriptionByStudentInput>();

  const otpValue = watch("otpCode") ?? "";
  const digits = otpValue.split("");
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const updateOtp = (newDigits: string[]) => {
    const joined = newDigits.join("");
    setValue("otpCode", joined, {
      shouldValidate: joined.length === lengthOtpCode,
    });
  };

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (!value) return;

    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    updateOtp(newDigits);

    if (index < lengthOtpCode - 1) {
      inputsRef.current[index + 1]?.focus();
    } else {
      trigger("otpCode");
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newDigits = [...digits];

      if (newDigits[index]) {
        newDigits[index] = "";
        updateOtp(newDigits);
      } else if (index > 0) {
        newDigits[index - 1] = "";
        updateOtp(newDigits);
        inputsRef.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < lengthOtpCode - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, lengthOtpCode);
    if (!pasted) return;

    setValue("otpCode", pasted, {
      shouldValidate: pasted.length === lengthOtpCode,
    });

    const nextIndex = Math.min(pasted.length, lengthOtpCode - 1);
    inputsRef.current[nextIndex]?.focus();
  };

  const resendCode = async () => {
    const result = await getOtpCodeAction({
      email: getValues("email"),
      numCNIPassport: getValues("numCNIPassport"),
    });

    if (result.serverError || result.validationErrors) {
      if (result.serverError?.code === "TOO_MANY_REQUEST") {
        setError("root", { message: result.serverError.global ?? "" });

        if (result.serverError.meta?.waitingTime) {
          setCount(result.serverError.meta?.waitingTime);
        }
      } else {
        setError("root", {
          message:
            "Une erreur a été rencontré pendant l'envoie du code. S'il vous plait veillez ressayé",
        });
      }
    } else {
      toast.success("Un nouveau code vient d'etre envoyé", {
        position: "top-center",
      });

      setCount(0);
    }
  };

  const { current, setCount } = useContextCounter();

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-base-200 px-6 py-4 text-xl text-center">
        <p>
          Un code à {lengthOtpCode} chiffres a été envoyé à votre email.
          Veuillez saisir ce code
        </p>
      </div>
      <div className="flex flex-col gap-3 items-center text-xl">
        <div className="flex gap-4">
          {Array.from({ length: lengthOtpCode }).map((_, index) => (
            <input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={digits[index] ?? ""}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="input p-1 text-center text-lg w-10"
              maxLength={1}
            />
          ))}
        </div>

        {errors.otpCode && (
          <p className="text-error text-sm">{errors.otpCode.message}</p>
        )}

        {current ? (
          <div className="flex gap-1 flex-col items-center text-sm">
            <p className="text-base">Temps restant</p>
            <p className="text-primary text-base font-semibold">
              {formatWaitTime(current)}
            </p>
          </div>
        ) : null}

        <div className="flex gap-1 flex-col items-center text-sm">
          <p className="text-base">Vous n'avez pas reçu de code ?</p>
          <button
            type="button"
            className="btn btn-link btn-primary"
            onClick={resendCode}
            disabled={!!current}
          >
            Renvoyer le code
          </button>
        </div>
      </div>
    </div>
  );
};
