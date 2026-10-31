"use client";

import { FunctionComponent, useCallback, useState } from "react";
import {
  FieldValues,
  Path,
  useForm,
  UseFormProps,
  UseFormSetError,
  UseFormReturn,
} from "react-hook-form";
import { useStepPersistence, PersistStorageType } from "./useStepPersistence";
import {
  useFormPersistence,
  readPersistedFormValues,
} from "./useFormPersistence";

export type StepResult<
  Data extends Record<string, any> = {},
  Error extends Record<string, any> = {},
> =
  | { success: true; data?: Data; error?: undefined }
  | { success: false; error?: Error; data?: undefined };

export type Step<
  TForm extends FieldValues,
  TFields extends readonly Path<TForm>[] = Path<TForm>[],
  Data extends Record<string, any> = {},
  Error extends Record<string, any> = {},
> = {
  label: string;
  handle?(
    data: TForm,
    setError: UseFormSetError<TForm>,
  ): Promise<StepResult<Data, Error>>;
  component: FunctionComponent;
  fields: TFields;
};

// 🆕 découplé de FormData pour casser le cycle d'inférence
type AnyStep<TForm extends FieldValues = any> = Step<
  TForm,
  readonly Path<TForm>[],
  any,
  any
>;

type StepsResult<TSteps extends readonly AnyStep<any>[]> =
  TSteps[number] extends Step<any, any, infer D, infer E>
    ? StepResult<D, E>
    : never;

export type MultiStepFormReturn<
  FormData extends FieldValues,
  TSteps extends readonly AnyStep<FormData>[] = readonly AnyStep<FormData>[],
> = UseFormReturn<FormData> & {
  currentStepPending: boolean;
  currentStep: number;
  nextStep: () => Promise<StepsResult<TSteps> & { validationFailed?: boolean }>;
  previousStep: () => void;
  clearPersisted: () => void;
};

export type MultiStepPersistOptions<TExclude = string> = {
  key: string;
  storage?: PersistStorageType;
  ttl?: number;
  persistValues?: boolean;
  excludeFields?: TExclude[];
};

export function createStep<TForm extends FieldValues>() {
  return function <
    const TFields extends readonly Path<TForm>[],
    TData extends Record<string, any> = {},
    TError extends Record<string, any> = {},
  >(step: Step<TForm, TFields, TData, TError>) {
    return step;
  };
}

export function useMultiStepForm<
  TSteps extends readonly AnyStep<any>[],
  FormData extends FieldValues,
>(
  steps: TSteps,
  props: UseFormProps<FormData>,
  persist?: MultiStepPersistOptions,
): MultiStepFormReturn<FormData, TSteps> {
  const storage = persist?.storage ?? "session";

  const persistedValues = persist?.persistValues
    ? readPersistedFormValues<FormData>({
        key: `${persist.key}:values`,
        storage,
        ttl: persist.ttl,
      })
    : null;

  const methods = useForm<FormData>({
    ...props,
    defaultValues: persistedValues
      ? ({
          ...(props.defaultValues as Partial<FormData> | undefined),
          ...persistedValues,
        } as UseFormProps<FormData>["defaultValues"])
      : props.defaultValues,
  });

  const {
    step: currentStep,
    commitStep,
    goToStep,
    clearStep,
  } = useStepPersistence({
    key: `${persist?.key ?? "form"}:step`,
    // storage,
    maxStep: steps.length,
    enabled: !!persist,
  });

  const { persistValues, clearValues } = useFormPersistence<FormData>({
    key: `${persist?.key ?? "form"}:values`,
    storage,
    ttl: persist?.ttl,
    exclude: persist?.excludeFields,
    enabled: !!persist?.persistValues,
  });

  const [currentStepPending, setCurrentStepPending] = useState(false);

  const previousStep = useCallback(() => {
    goToStep((s) => (s === 0 ? s : s - 1));
  }, [goToStep]);

  const clearPersisted = useCallback(() => {
    clearStep();
    clearValues();
  }, [clearStep, clearValues]);

  const nextStep: MultiStepFormReturn<FormData, TSteps>["nextStep"] =
    useCallback(async () => {
      setCurrentStepPending(true);
      const isLastStep = currentStep === steps.length - 1;
      const currentStepConfig = steps[currentStep] as AnyStep<FormData>;
      const fields = currentStepConfig.fields as Path<FormData>[];
      const isValid = await methods.trigger(fields);

      if (!isValid) {
        setCurrentStepPending(false);
        return {
          success: false,
          validationFailed: true,
        } as unknown as StepsResult<TSteps> & { validationFailed?: boolean };
      }

      const result = methods.getValues();

      const resultHandle = currentStepConfig.handle
        ? await currentStepConfig.handle(result, methods.setError)
        : ({ success: true } as const);

      if (!resultHandle.success) {
        setCurrentStepPending(false);
        return resultHandle as StepsResult<TSteps> & {
          validationFailed?: boolean;
        };
      }

      if (isLastStep) {
        clearPersisted();
      } else {
        persistValues(methods.getValues());
        commitStep((s) => s + 1);
      }

      methods.clearErrors("root");
      setCurrentStepPending(false);
      return resultHandle as StepsResult<TSteps> & {
        validationFailed?: boolean;
      };
    }, [
      currentStep,
      methods,
      steps,
      persistValues,
      commitStep,
      clearPersisted,
      setCurrentStepPending,
    ]);

  return {
    ...methods,
    currentStepPending,
    currentStep,
    nextStep,
    previousStep,
    clearPersisted,
  };
}
