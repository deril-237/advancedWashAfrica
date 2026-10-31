"use client";

import { Send, Mail, MessageSquare, User, Tag } from "lucide-react";
import Input from "@/components/atoms/Input";
import TextArea from "@/components/atoms/TextArea";
import { Button } from "@/components/atoms/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendContactMessage } from "../actions";
import { AlertResponse } from "@/components/atoms/AlertResponse";
import { contactsSchema } from "../schema";

export function FormContacts() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(contactsSchema) });

  const submit = handleSubmit(
    async (data) => {
      const result = await sendContactMessage(data);

      if (result.serverError) {
        setError("root", {
          message:
            "Une erreur est survenue pendant l'envoi de votre message. Veuillez réessayer ultérieurement.",
        });
      }
    },
    (error) => {
      console.log(error);
    },
  );

  return (
    <form
      onSubmit={submit}
      className="relative overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm"
    >
      {/* Decorative element */}
      <div className="absolute -right-16 -top-16 size-40 rounded-full bg-primary/4" />
      <div className="absolute -bottom-20 -left-16 size-40 rounded-full bg-secondary/8" />

      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-base-300 bg-primary/3 px-6 py-7 sm:px-8">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-secondary shadow-sm">
              <MessageSquare size={22} strokeWidth={1.8} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">
                Contact
              </p>

              <h2 className="mt-1 text-2xl font-bold text-primary">
                Contactez-nous
              </h2>

              <p className="mt-2 text-sm leading-6 text-base-content/60">
                Une question ou besoin d'informations ? Notre équipe est à votre
                écoute.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-5 px-6 py-7 sm:px-8">
          {/* Server error */}
          {errors.root?.message && (
            <AlertResponse type="error" message={errors.root.message} />
          )}

          {/* Name */}
          <div className="relative">
            <Input
              label="Votre nom"
              placeholder="Paul Jean"
              className="rounded-xl border-base-300 bg-base-100 pl-11 transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              {...register("name")}
            />

            <User
              size={18}
              className="pointer-events-none absolute left-3.5 top-9.5 text-primary/50"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Input
              label="Votre email"
              placeholder="paul@gmail.com"
              type="email"
              className="rounded-xl border-base-300 bg-base-100 pl-11 transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              {...register("email")}
            />

            <Mail
              size={18}
              className="pointer-events-none absolute left-3.5 top-9.5 text-primary/50"
            />
          </div>

          {/* Subject */}
          <div className="relative">
            <Input
              label="Objet"
              placeholder="Comment s'inscrire à une formation ?"
              className="rounded-xl border-base-300 bg-base-100 pl-11 transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              {...register("subject")}
            />

            <Tag
              size={18}
              className="pointer-events-none absolute left-3.5 top-9.5 text-primary/50"
            />
          </div>

          {/* Message */}
          <div>
            <TextArea
              label="Votre message"
              placeholder="Décrivez votre demande..."
              className="min-h-36 resize-none rounded-xl border-base-300 bg-base-100 transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              {...register("message")}
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-secondary h-12 w-full rounded-xl border-none font-bold text-primary shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                Envoi en cours...
              </>
            ) : (
              <>
                Envoyer le message
                <Send size={18} />
              </>
            )}
          </Button>

          {/* Privacy note */}
          <p className="text-center text-xs leading-5 text-base-content/45">
            Vos informations sont utilisées uniquement pour répondre à votre
            demande.
          </p>
        </div>
      </div>
    </form>
  );
}
