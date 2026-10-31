"use client";

import { Check } from "lucide-react";

export type StepperStep = {
  label: string;
};

export type StepperProps = {
  steps: readonly StepperStep[];
  currentStep: number; // index 0-based
};

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div>
      <ol
        className="flex w-full items-center justify-between gap-2 md:gap-4"
        aria-label="Étapes de l'inscription"
      >
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <li
              key={step.label}
              className="flex flex-1 items-center last:flex-none"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-current={isCurrent ? "step" : undefined}
                  className={`
                    flex h-8 w-8 shrink-0 items-center justify-center rounded-full
                    text-sm font-semibold transition-all duration-200
                    ${isCompleted ? "bg-primary text-primary-content" : ""}
                    ${isCurrent ? "bg-primary text-primary-content ring-4 ring-primary/20" : ""}
                    ${
                      !isCompleted && !isCurrent
                        ? "border border-base-300 bg-base-200 text-base-content/50"
                        : ""
                    }
                  `}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                </span>
                <span
                  className={`
                    hidden text-sm font-medium md:block
                    ${isCurrent ? "text-base-content" : "text-base-content/50"}
                  `}
                >
                  {step.label}
                </span>
              </div>

              {!isLast && (
                <div
                  className={`
                    mx-2 h-0.5 flex-1 rounded-full transition-colors duration-200 md:mx-3
                    ${isCompleted ? "bg-primary" : "bg-base-300"}
                  `}
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* current step's label on mobile */}
      <p className="mt-3 text-center text-sm font-medium text-base-content md:hidden">
        {steps[currentStep]?.label}
      </p>
    </div>
  );
}
