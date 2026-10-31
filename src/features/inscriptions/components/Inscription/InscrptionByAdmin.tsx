"use client";

import { AlertResponse } from "@/components/atoms/AlertResponse";
import { Button, ButtonLoading } from "@/components/atoms/Button";
import { Stepper } from "@/components/atoms/Stepper";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { applyActionErrors } from "@/lib/forms/applyActionError";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { FunctionComponent } from "react";
import { FormProvider } from "react-hook-form";
import { toast } from "react-toastify";
import { useMutationInscription } from "../../hooks";
import { formInscriptionSchema } from "../../schemas";
import { STEPS_ADMIN as STEPS, stepsTitleAdmin } from "./configInscriptionForm";
import { SectionTitle } from "./SectionTitle";

export const InscriptionByAdminForm: FunctionComponent = () => {
  const {
    nextStep,
    previousStep,
    currentStep,
    currentStepPending,
    ...methods
  } = useMultiStepForm(STEPS, {
    resolver: zodResolver(formInscriptionSchema),
  });

  const { mutateAsync: inscription } = useMutationInscription();
  const Component = STEPS[currentStep].component;

  const handleSubmit = methods.handleSubmit(
    async (data) => {
      const success = await nextStep();
      if (!success) {
        return;
      }

      const result = await inscription(data);

      if (result.serverError) {
        applyActionErrors(result.serverError, methods.setError);
      }

      toast.success("L'inscrition a été enregistré avec success", {
        position: "top-center",
      });
    },
    (errors) => {
      console.log("VALIDATION ERROR", errors);
    },
  );

  const stepTitle = stepsTitleAdmin[currentStep];

  return (
    <FormProvider {...methods}>
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
          <Stepper steps={STEPS} currentStep={currentStep} />
        </div>

        {/* Card principale */}
        <div className="rounded-2xl border border-base-300 bg-base-100 shadow-sm">
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
              onClick={
                currentStep === STEPS.length - 1 ? handleSubmit : nextStep
              }
              disabled={currentStepPending || methods.formState.isSubmitting}
              loadingComponent={
                <span className="loading loading-spinner loading-sm"></span>
              }
              // type="submit"
              className="btn btn-primary gap-2 disabled:cursor-not-allowed"
            >
              {currentStep === STEPS.length - 1 ? "Envoyer" : "Suivant"}
            </ButtonLoading>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};
