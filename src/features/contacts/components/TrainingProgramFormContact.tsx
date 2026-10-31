"use client";

import { AlertResponse } from "@/components/atoms/AlertResponse";
import { Button } from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import TextArea from "@/components/atoms/TextArea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, MessageSquare, Send } from "lucide-react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { sendContactOnTrainingProgramMessage } from "../actions";
import { contactWithTrainingProgramSchema } from "../schema";

export function TrainingProgramContactForm() {
  const { trainingId } = useParams<{ trainingId: string }>();

  const {
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    register,
    setError,
  } = useForm({
    resolver: zodResolver(contactWithTrainingProgramSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    const result = await sendContactOnTrainingProgramMessage(trainingId, data);
    if (result.serverError) {
      setError("root", {
        message:
          "Une erreur est survenue pendant l'envoi de votre message. Veuillez réessayer ultérieurement.",
      });
    }
  });

  return (
    <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
      {/* Header */}
      <div className="border-b border-base-300 bg-primary/5 px-6 py-6">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-secondary">
            <MessageSquare size={21} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary">Need help ?</h2>

            <p className="mt-1 text-sm leading-6 text-base-content/60">
              Do you have a question about this training program? Contact our
              team.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-5 p-6">
        {isSubmitSuccessful && (
          <AlertResponse
            type="success"
            message={
              "Thank you for your request. We will send you an email in response. "
            }
          />
        )}

        {errors.root?.message && (
          <AlertResponse type="error" message={errors.root.message} />
        )}
        {/* Email */}
        <div className="relative">
          <Input
            label="Your email"
            placeholder="paul@gmail.com"
            type="email"
            className="rounded-xl border-base-300 bg-base-100 pl-11 transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            {...register("email")}
            error={errors.email?.message}
          />

          <Mail
            size={18}
            className="pointer-events-none absolute left-3.5 top-9.5 text-primary/50"
          />
        </div>

        {/* Message */}
        <div>
          <TextArea
            label="Your message"
            placeholder="Describe you request..."
            className="min-h-36 resize-none rounded-xl border-base-300 bg-base-100 transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            {...register("message")}
            error={errors.message?.message}
          />
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-secondary h-12 w-full rounded-xl border-none font-bold text-primary shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md disabled:opacity-70"
        >
          <>
            Send
            <Send size={18} />
          </>
        </Button>

        {/* Privacy */}
        <p className="text-center text-xs leading-5 text-base-content/45">
          Your email used only for to response to your request.
        </p>
      </form>
    </div>
  );
}
