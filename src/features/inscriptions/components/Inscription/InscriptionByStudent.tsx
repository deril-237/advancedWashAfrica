"use client";

import { Button, ButtonLoading } from "@/components/atoms/Button";
import { Stepper } from "@/components/atoms/Stepper";
import {
  useMultiStepForm,
  MultiStepFormReturn,
} from "@/hooks/useMultiStepForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { FunctionComponent, useCallback, useState } from "react";
import { FormProvider } from "react-hook-form";
import { AlertResponse } from "@/components/atoms/AlertResponse";
import { applyActionErrors } from "@/lib/forms/applyActionError";
import { useMutationInscriptionByStudent } from "../../hooks";
import { formInscriptionByStudentInputSchema } from "../../schemas";
import { STEPS_STUDENT, stepsTitleStudent } from "./configInscriptionForm";
import { SectionTitle } from "./SectionTitle";
import {
  CounterProvider,
  useContextCounter,
} from "@/providers/CounterProvider";
import { StudentFirstInscriptionByStudentInput } from "../../types";

export const InscriptionByStudentForm: FunctionComponent = () => {
  const {
    nextStep,
    previousStep,
    currentStep,
    currentStepPending,
    ...methods
  } = useMultiStepForm(STEPS_STUDENT, {
    resolver: zodResolver(formInscriptionByStudentInputSchema),
  });

  const { mutateAsync: inscription } = useMutationInscriptionByStudent();
  const [waitingTime, setWaitingTime] = useState<number | undefined>(undefined);
  const Component = STEPS_STUDENT[currentStep].component;

  const onSubmit = methods.handleSubmit(async (data) => {
    const stepResult = await nextStep();

    if (!stepResult.success) {
      stepResult.error;
      const error = stepResult.error as any;
      setWaitingTime(error?.waitingTime);
    }

    const result = await inscription(data);

    if (result.serverError) {
      applyActionErrors(result.serverError, methods.setError);
    }
  });

  const stepTitle = stepsTitleStudent[currentStep];
  return (
    <FormProvider {...methods}>
      <CounterProvider count={waitingTime}>
        <div className="mx-auto w-full max-w-4xl px-4 py-8 md:py-12">
          {/* En-tête */}
          <div className="mb-8 flex flex-col gap-2 text-center">
            <h1 className="font-heading text-3xl font-bold text-base-content md:text-4xl">
              Inscription à la formation
            </h1>
            <p className="text-base text-base-content/60">
              Renseignez vos informations en quelques étapes simples et rapides.
            </p>
          </div>

          {/* Stepper */}
          <div className="mb-8">
            <Stepper steps={STEPS_STUDENT} currentStep={currentStep} />
          </div>

          {/* Card principale */}
          <div className="rounded-2xl border border-base-300 bg-base-100 shadow-sm">
            {methods.formState.isSubmitSuccessful ? (
              <SuccessfulMessage />
            ) : (
              <>
                {" "}
                <div className="flex flex-col gap-8 p-6 md:p-10">
                  <div className="flex flex-col gap-8">
                    <SectionTitle
                      title={stepTitle.title}
                      icon={stepTitle.icon}
                      description={stepTitle.description}
                    />
                    {methods.formState.errors.root?.message && (
                      <AlertResponse
                        type="error"
                        message={methods.formState.errors.root.message}
                      />
                    )}
                    <Component />
                  </div>
                </div>
                {/* Barre d'actions */}
                <ActionButton
                  previousStep={previousStep}
                  nextStep={nextStep}
                  currentStep={currentStep}
                  currentStepPending={currentStepPending}
                  onSubmit={onSubmit}
                  {...methods}
                />
              </>
            )}
          </div>
        </div>
      </CounterProvider>
    </FormProvider>
  );
};

export function SuccessfulMessage() {
  return (
    <div className="rounded-2xl border border-dashed border-primary/20 bg-primary/5 px-6 py-10 text-center">
      <h3 className="mt-4 font-bold text-primary">Dossier soumis</h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-base-content/60">
        Votre dossier a été soumis. Notre equipe examinera votre dossier et un
        email de confirmation vous sera envoyez. Merçi pour votre inscription
      </p>
    </div>
  );
}

export function ActionButton({
  currentStep,
  previousStep,
  nextStep,
  currentStepPending,
  formState,
  onSubmit,
}: MultiStepFormReturn<StudentFirstInscriptionByStudentInput> & {
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}) {
  const count = useContextCounter();

  const submit = useCallback(() => {
    if (currentStep === STEPS_STUDENT.length - 1) {
      onSubmit();
    } else {
      nextStep();
    }
  }, [currentStep]);

  const pending = currentStepPending || formState.isSubmitting;
  const disabled = pending || !!count.current;

  return (
    <div className="flex flex-row items-center justify-between gap-4 border-t border-base-300 px-6 py-4 md:px-10">
      {currentStep !== 0 && (
        <Button
          onClick={previousStep}
          type="button"
          className="btn btn-outline btn-secondary gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
      )}
      <ButtonLoading
        onClick={submit}
        disabled={disabled}
        className="btn btn-primary gap-2 disabled:cursor-not-allowed"
      >
        {pending ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : null}

        {currentStep === STEPS_STUDENT.length - 1 ? "Envoyer" : "Suivant"}
      </ButtonLoading>
    </div>
  );
}
