import { Identifier } from "@/interfaces/entities";
import { ConflictError } from "@/lib/errors/appError";
import { consumeRateLimit, uploadSignatureRateLimit } from "@/lib/rate-limit";
import { FirstInscriptionByStudentDTO, InscriptionStatus } from "../types";
import {
  firstStudentInscription,
  getSignature,
  sendConfirmationMail,
} from "./inscription.service";
import { validateSession } from "./otp.service";

export async function getSignatureForStudent(sessionId: Identifier) {
  await consumeRateLimit(uploadSignatureRateLimit, sessionId);
  await validateSession(sessionId);
  return getSignature();
}

export async function firstInscriptionByStudent(
  data: FirstInscriptionByStudentDTO,
  pendingId: Identifier,
) {
  const pendingRegistration = await validateSession(pendingId);

  if (pendingRegistration.used === false) {
    throw new ConflictError(
      {},
      "Session invalide. FOurnissez le code otp d'abord s'il vous plait",
    );
  }

  const result = await firstStudentInscription(
    data,
    InscriptionStatus.SUBMITTED,
  );

  await sendConfirmationMail(data.trainingProgramId, result, true);
}
