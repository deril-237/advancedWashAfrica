import { Phone, ShieldQuestionMark, ArrowRight, Mail } from "lucide-react";
import { Banner } from "../_components/Banners";
import { FormContacts } from "@/features/contacts/components";
import { CallToAction } from "../_components/CallToAction";
import Link from "next/link";
import { FadeOut } from "@/components/atoms/FadeOut";

export type QuestionCardProps = {
  question: string;
  response: string;
};

export const questions: QuestionCardProps[] = [
  {
    question: "Quelle est la procédure pour s'inscrire à une formation ?",
    response:
      "Consultez la formation qui vous intéresse, choisissez le parcours correspondant à vos objectifs puis suivez les étapes d'inscription indiquées. Notre équipe reste disponible pour vous accompagner.",
  },
  {
    question: "Les attestations fournies sont-elles reconnues ?",
    response:
      "À l'issue de votre formation, une attestation peut être délivrée selon les conditions du programme suivi. Pour connaître les modalités précises, contactez notre équipe.",
  },
  {
    question: "Comment choisir la formation qui me correspond ?",
    response:
      "Nos programmes sont conçus autour de différents domaines et niveaux de compétences. Consultez les détails de chaque formation ou contactez-nous afin d'être orienté vers le parcours adapté à votre projet.",
  },
  {
    question: "Comment puis-je obtenir plus d'informations ?",
    response:
      "Vous pouvez utiliser le formulaire de contact présent sur cette page. Notre équipe prendra connaissance de votre demande et vous répondra dans les meilleurs délais.",
  },
];

export default function Contacts() {
  return (
    <div className="min-h-screen bg-base-100">
      {" "}
      {/* Hero */}{" "}
      <Banner icon={Phone}>
        <FadeOut>
          <div className="w-full mx-auto max-w-7xl flex px-6 items-center  h-120">
            <div className="max-w-4xl">
              <h1 className="text-4xl font-black capitalize leading-tight text-base-100 md:text-6xl">
                FAQ & Contacts
              </h1>

              <p className="max-w-2xl text-lg leading-8 text-base-100/80">
                Avez vous des questions sur nos programmes formations ? <br />
                Consulter notre FAQ ou contact directement notre équipe
                universitaire international
              </p>
            </div>
          </div>
        </FadeOut>
      </Banner>
      {/* Main content */}{" "}
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        {" "}
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          {" "}
          {/* FAQ */}{" "}
          <section>
            {" "}
            <div className="mb-8 max-w-2xl">
              {" "}
              <div className="mb-4 flex items-center gap-3">
                {" "}
                <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary/15 text-secondary">
                  {" "}
                  <ShieldQuestionMark size={22} />{" "}
                </div>{" "}
                <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary/60">
                  {" "}
                  FAQ{" "}
                </span>{" "}
              </div>{" "}
              <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                {" "}
                Les réponses à vos questions{" "}
              </h2>{" "}
              <p className="mt-4 text-base leading-7 text-base-content/60">
                {" "}
                Retrouvez les informations les plus demandées concernant nos
                formations, les inscriptions et l'accompagnement proposé par
                notre équipe.{" "}
              </p>{" "}
            </div>{" "}
            <div className="space-y-3">
              {" "}
              {questions.map((question, index) => (
                <QuestionCard {...question} key={index} />
              ))}{" "}
            </div>{" "}
            {/* Additional contact information */}{" "}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {" "}
              <div className="rounded-2xl border border-base-300 bg-base-100 p-5 transition-colors hover:border-primary/20">
                {" "}
                <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {" "}
                  <Mail size={19} />{" "}
                </div>{" "}
                <p className="text-sm font-semibold text-primary">
                  {" "}
                  Besoin d'aide ?{" "}
                </p>{" "}
                <p className="mt-1 text-sm leading-6 text-base-content/55">
                  {" "}
                  Envoyez-nous votre demande et notre équipe vous répondra.{" "}
                </p>{" "}
              </div>{" "}
              <div className="rounded-2xl border border-base-300 bg-base-100 p-5 transition-colors hover:border-primary/20">
                {" "}
                <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-secondary/15 text-primary">
                  {" "}
                  <Phone size={19} />{" "}
                </div>{" "}
                <p className="text-sm font-semibold text-primary">
                  {" "}
                  Un accompagnement personnalisé{" "}
                </p>{" "}
                <p className="mt-1 text-sm leading-6 text-base-content/55">
                  {" "}
                  Notre équipe est disponible pour vous orienter dans votre
                  parcours.{" "}
                </p>{" "}
              </div>{" "}
            </div>{" "}
          </section>{" "}
          {/* Contact form */}{" "}
          <section className="lg:sticky lg:top-8">
            {" "}
            <FormContacts />{" "}
          </section>{" "}
        </div>{" "}
      </main>{" "}
      {/* CTA */}{" "}
      <CallToAction>
        <span className="inline-flex rounded-full bg-secondary/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-secondary">
          {" "}
          Votre prochaine étape{" "}
        </span>{" "}
        <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {" "}
          Une question qui reste sans réponse ?{" "}
        </h2>{" "}
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-white/65">
          {" "}
          Notre équipe est là pour vous accompagner et vous aider à trouver la
          formation qui correspond à votre projet.{" "}
        </p>{" "}
        <Link
          href={`/trainings`}
          className="btn btn-secondary mt-8 rounded-xl border-none px-6 font-bold text-primary"
        >
          {" "}
          Découvrir nos formations <ArrowRight size={18} />{" "}
        </Link>{" "}
      </CallToAction>
    </div>
  );
}

export function QuestionCard({ question, response }: QuestionCardProps) {
  return (
    <details className="group rounded-xl border border-base-300 bg-base-100">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold text-primary">
        <span>{question}</span>

        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-open:rotate-45">
          +
        </span>
      </summary>

      <div className="border-t border-base-300 px-5 pb-5 pt-4 text-sm leading-7 text-base-content/65">
        {response}
      </div>
    </details>
  );
}
