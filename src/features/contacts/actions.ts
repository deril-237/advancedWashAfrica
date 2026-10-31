"use server";
import { actionClient } from "@/lib/safeAction";
import { emailsService } from "@/lib/emails";
import { getAdmin } from "@/features/users";
import { contactsSchema, contactWithTrainingProgramSchema } from "./schema";
import { identifierSchema } from "@/lib/zodRules";
import { getTrainingProgram } from "../trainings/services";
import { ContactMailToAdmin } from "@/emails/templates/ContactMailToAdmin";
import { TrainingProgramContactEmailToAdmin } from "@/emails/templates/TrainingProgramContactEmail";
import { consumeRateLimit, contactMessageRateLimit } from "@/lib/rate-limit";
import { getIp } from "@/lib/utils-server";

export const sendContactMessage = actionClient
  .inputSchema(contactsSchema)
  .action(async ({ parsedInput }) => {
    const ip = await getIp();
    await consumeRateLimit(
      contactMessageRateLimit,
      `${ip}-${parsedInput.email}`,
    );
    const admin = await getAdmin();

    emailsService.sendMail({
      to: admin.email,
      react: ContactMailToAdmin({
        subject: `Nouveau message`,
        email: parsedInput.email,
        name: parsedInput.name,
        message: parsedInput.message,
      }),
      subject: parsedInput.subject + `${parsedInput.name} ${parsedInput.email}`,
    });
  });

export const sendContactOnTrainingProgramMessage = actionClient
  .bindArgsSchemas([identifierSchema])
  .inputSchema(contactWithTrainingProgramSchema)

  .action(async ({ parsedInput, bindArgsClientInputs }) => {
    const ip = await getIp();
    await consumeRateLimit(
      contactMessageRateLimit,
      `${ip}-${parsedInput.email}`,
    );
    const admin = await getAdmin();

    const [trainingProgramId] = bindArgsClientInputs;

    const trainingProgram = await getTrainingProgram(trainingProgramId);

    await emailsService.sendMail({
      to: admin.email,
      react: TrainingProgramContactEmailToAdmin({
        subject: `enseignement sur ${trainingProgram.training.name}`,
        email: parsedInput.email,
        trainingProgramName: `${trainingProgram.training.name} durrée ${trainingProgram.program.duration} mois`,
        message: parsedInput.message,
      }),
      // html: parsedInput.message,
      subject: `${trainingProgram.training.name}`,
    });
  });
