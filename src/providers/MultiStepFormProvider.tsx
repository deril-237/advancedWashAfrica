import { Children, createContext, FunctionComponent, JSX } from "react";
import { useMultiStepForm } from "../hooks/useMultiStepForm";

export type MultiStepFormContextType<OtherData = unknown> = {
  form: ReturnType<typeof useMultiStepForm>;
  other: OtherData;
};

const MultiFormProvider = createContext<MultiStepFormContextType | null>(null);

export function MultiStepFormProvider<OtherData = unknown>({
  form,
  other,
  children,
}: MultiStepFormContextType<OtherData> & { children: JSX.Element }) {
  return (
    <MultiFormProvider value={{ form, other }}>{children}</MultiFormProvider>
  );
}

export function useMultiStepFormContext() {}
