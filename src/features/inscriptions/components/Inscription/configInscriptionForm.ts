import { createStep } from "@/hooks/useMultiStepForm";
import { FileText, GraduationCap, UserRound } from "lucide-react";
import { Step1PersonalInformation } from "./Step1PersonalInformations";
import { Step2ChooseTraining } from "./Step2ChooseTraining";
import { Step3Attachments } from "./Step3Attachments";

import { applyActionErrors } from "@/lib/forms/applyActionError";
import { verifyOtpCodeAction } from "../../actions";
import { StudentFirstInscriptionByStudentInput } from "../../types";
import {
  checkNumCniPassportAndEmailAction,
  checkWaveAction,
  getOtpCodeAction,
} from "./../../actions";
import { SectionTitleProps } from "./SectionTitle";
import { Step4CheckOTPCode } from "./Step4CheckOtpCode";

const step = createStep<StudentFirstInscriptionByStudentInput>();

const COMMON_STEPS = [
  step({
    label: "Informations personnelles",
    handle: async (data, setError) => {
      const result = await checkNumCniPassportAndEmailAction(
        data.numCNIPassport,
        data.email,
      );

      if (result.serverError) {
        applyActionErrors(result.serverError, setError);
        return { success: false };
      }

      return { success: true };
    },
    component: Step1PersonalInformation,
    fields: [
      "birthDate",
      "birthPlace",
      "email",
      "numCNIPassport",
      "name",
      "secondName",
      "residence",
      "phone",
    ],
  }),

  step({
    label: "Choix de la formation",
    component: Step2ChooseTraining,
    fields: [
      "modality",
      "trainingProgramId",
      "motivations",
      "otherMotivation",
      "trainingId",
    ],
    handle: async (data, setError) => {
      const result = await checkWaveAction({
        trainingProgramId: data.trainingProgramId,
      });
      if (result.serverError) {
        applyActionErrors(result.serverError, setError);
        return { success: false };
      }

      return { success: true };
    },
  }),
];

export const STEPS_ADMIN = [
  ...COMMON_STEPS,
  step({
    label: "Pièces justificatives",
    component: Step3Attachments,
    fields: ["diploma", "photo", "cniPassport"] as const,
    // handle: async (data, setError) => {
    //   firstStudentInscriptionByAdminAction({});
    //   const result = await getOtpCodeAction({
    //     email: data.email,
    //     numCNIPassport: data.numCNIPassport,
    //   });

    //   if (result.serverError) {
    //     applyActionErrors(result.serverError, setError);
    //     return { success: false };
    //   }

    //   return { success: true };
    // },
  }),
];

export const STEPS_STUDENT = [
  ...COMMON_STEPS,
  step({
    label: "Pièces justificatives",
    component: Step3Attachments,
    fields: ["diploma", "photo", "cniPassport"] as const,
    handle: async (data, setError) => {
      const result = await getOtpCodeAction({
        email: data.email,
        numCNIPassport: data.numCNIPassport,
      });

      if (result.serverError) {
        applyActionErrors(result.serverError, setError);
        return { success: false };
      }

      return { success: true };
    },
  }),
  step({
    label: "Vérificaition de l'email",
    component: Step4CheckOTPCode,
    fields: ["otpCode"] as const,
    handle: async (data, setError) => {
      const result = await verifyOtpCodeAction({ otpCode: data.otpCode });

      if (result.serverError) {
        applyActionErrors(result.serverError, setError);
        return {
          success: false,
          error: { waitingTime: result.serverError.meta?.waitingTime },
        };
      }

      return { success: true };
    },
  }),
];

export const stepsTitleAdmin: SectionTitleProps[] = [
  {
    icon: UserRound,
    title: "Informations personnelles",
    description:
      "Ces informations doivent correspondre à votre pièce d'identité.",
  },
  {
    icon: GraduationCap,
    title: "Choix de la formation",
    description:
      "Sélectionnez la formation et le parcours qui vous correspondent.",
  },
  {
    icon: FileText,
    title: "Pièces, jointes",
    description: "Formats acceptés : JPG, PNG, PDF.",
  },
];

export const stepsTitleStudent: SectionTitleProps[] = [
  ...stepsTitleAdmin,
  {
    icon: UserRound,
    title: "Verification d'email",
    description: "Cette étape permet de verfier votre identité",
  },
];
