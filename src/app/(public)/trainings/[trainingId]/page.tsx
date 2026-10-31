import { getTrainingProgramDetailsAction } from "@/features/trainings";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BriefcaseBusiness,
  BookOpen,
  Check,
  Clock3,
  Folder,
  GraduationCap,
  Layers3,
  ListChecks,
} from "lucide-react";

import { getModuleListAction } from "@/features/modules/actions";
import { Module } from "@/features/modules/types";
import { TrainingProgramContactForm } from "@/features/contacts/components";

type TrainingProgramDetails = Awaited<
  ReturnType<typeof getTrainingProgramDetailsAction>
>["data"];

export default async function TrainingProgramPage({
  params,
}: PageProps<"/trainings/[trainingId]">) {
  const { trainingId } = await params;

  const [{ data: trainingProgram }, { data: modules }] = await Promise.all([
    getTrainingProgramDetailsAction(trainingId),
    getModuleListAction(trainingId),
  ]);

  if (!trainingProgram || modules === undefined) {
    throw new Error(
      "Une erreur est survenue pendant le chargement de la formation. Veuillez réessayer ultérieurement.",
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* BREADCRUMB */}
        <div className="breadcrumbs mb-6 text-base">
          <ul>
            <li>
              <Link
                href="/trainings"
                className="text-base-content/60 transition-colors hover:text-primary"
              >
                Trainings
              </Link>
            </li>

            <li className="max-w-xs truncate font-medium text-primary">
              {trainingProgram.training.name}
            </li>
          </ul>
        </div>

        {/*hero */}
        <section className="relative overflow-hidden rounded-sm bg-primary px-6 py-8 md:px-10 md:py-10">
          {/* Decorative icon */}
          <div className="pointer-events-none absolute -right-10 -top-16 hidden opacity-10 md:block">
            <GraduationCap className="size-72 text-base-100" />
          </div>

          <div className="relative z-10 grid gap-8 md:grid-cols-[minmax(0,1fr)_260px] md:items-center">
            {/* Hero content */}
            <div>
              <div className="mb-4 inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" />

                <span className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">
                  Training Program
                </span>
              </div>

              <h1 className="max-w-3xl text-3xl font-bold leading-tight text-base-100 md:text-4xl lg:text-[2.75rem]">
                {trainingProgram.training.name}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-base-100/75 md:text-lg">
                {trainingProgram.training.description}
              </p>

              {/* Quick information */}
              <div className="mt-6 flex flex-wrap gap-3">
                <InfoBadge
                  icon={<Clock3 size={16} />}
                  label={`${trainingProgram.program.duration} months`}
                />

                <InfoBadge
                  icon={<Layers3 size={16} />}
                  label={`${modules.length} modules`}
                />

                <InfoBadge
                  icon={<BadgeCheck size={16} />}
                  label="CQP Diploma"
                />
              </div>
            </div>

            {/* Image */}
            <div className="relative mx-auto aspect-square w-full max-w-65 overflow-hidden rounded-2xl bg-base-100/10 shadow-lg">
              {trainingProgram.training.image ? (
                <Image
                  src={trainingProgram.training.image.url}
                  alt={trainingProgram.training.name}
                  fill
                  sizes="260px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-base-100">
                  <GraduationCap size={90} strokeWidth={1.2} />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* objective */}
        <section className="mt-10">
          <SectionTitle
            eyebrow="Presentation"
            title="About this training program"
          />

          <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm md:p-8">
            <div className="flex gap-4">
              <div className="hidden size-10 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary sm:flex">
                <BookOpen size={20} />
              </div>

              <p className="max-w-4xl text-base leading-8 text-base-content/70">
                {trainingProgram.training.objective}
              </p>
            </div>
          </div>
        </section>

        {/* Prerequisites, career opportunities, and diploma */}
        <section className="mt-10">
          <SectionTitle
            eyebrow="Your future"
            title="Prerequisites and career opportunities"
          />

          <div className="grid gap-5 md:grid-cols-2">
            <InfoListCard
              icon={<ListChecks size={20} />}
              title="Prerequisites"
              emptyMessage="No prerequisites have been specified for this training."
              items={trainingProgram.preRequests.map((item) => item.label)}
            />
            <InfoListCard
              icon={<BriefcaseBusiness size={20} />}
              title="Career opportunities"
              emptyMessage="Career opportunities will be shared soon."
              items={trainingProgram.carrerOpportunities.map(
                (item) => item.label,
              )}
            />
          </div>

          <div className="mt-5 flex items-start gap-4 rounded-2xl border border-secondary/40 bg-secondary/10 p-5 sm:p-6">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
              <Award size={23} />
            </div>
            <div>
              <h3 className="font-bold text-primary">
                A CQP diploma upon completion
              </h3>
              <p className="mt-1 text-sm leading-6 text-base-content/70">
                Every training program concludes with a Certificat de
                Qualification Professionnelle (CQP).
              </p>
            </div>
          </div>
        </section>

        {/* main content*/}
        <section className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
          {/* modules */}
          <div>
            <SectionTitle eyebrow="Programme" title="Training Modules" />

            <div className="space-y-4">
              {modules.length === 0 ? (
                <EmptyModules />
              ) : (
                modules.map((moduleProgram) => (
                  <ModuleCard key={moduleProgram.id} module={moduleProgram} />
                ))
              )}
            </div>
          </div>

          {/* sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <PriceCard {...trainingProgram} />
            <TrainingProgramContactForm />
          </aside>
        </section>
      </div>
    </div>
  );
}

function InfoListCard({
  icon,
  title,
  items,
  emptyMessage,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
  emptyMessage: string;
}) {
  return (
    <article className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-primary">{title}</h3>
      </div>

      {items.length > 0 ? (
        <ul className="mt-5 space-y-3">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm leading-6">
              <Check
                size={18}
                className="mt-1 shrink-0 text-secondary"
                aria-hidden="true"
              />
              <span className="text-base-content/75">{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 text-sm leading-6 text-base-content/60">
          {emptyMessage}
        </p>
      )}
    </article>
  );
}

function InfoBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-base-100/10 px-4 py-2 text-sm font-medium text-base-100">
      <span className="text-secondary">{icon}</span>

      <span>{label}</span>
    </div>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-secondary" />

        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary/60">
          {eyebrow}
        </p>
      </div>

      <h2 className="text-2xl font-extrabold tracking-tight text-primary md:text-3xl">
        {title}
      </h2>
    </div>
  );
}

export function ModuleCard({ module }: { module: Module }) {
  return (
    <article className="group rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md sm:p-5">
      <div className="flex gap-4">
        {/* Number */}
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary font-bold text-primary-content sm:size-12">
          {String(module.position).padStart(2, "0")}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-primary sm:text-lg">
            {module.name}
          </h3>

          <p className="mt-2 text-sm leading-6 text-base-content/65">
            {module.description}
          </p>
        </div>

        {/* Arrow */}
        <div className="hidden shrink-0 self-center text-primary/30 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary sm:block">
          <ArrowRight size={20} />
        </div>
      </div>
    </article>
  );
}

function PriceCard(trainingProgram: TrainingProgramDetails) {
  return (
    <div className="overflow-hidden rounded-2xl bg-primary text-primary-content shadow-lg">
      {/* Header */}
      <div className="border-b border-primary-content/10 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-extrabold uppercase text-primary">
              <BadgeCheck size={14} />
              Certified
            </span>

            <p className="mt-4 text-sm text-primary-content/60">
              Price of program
            </p>

            <p className="mt-1 text-2xl font-extrabold">
              {trainingProgram?.price} XAF
            </p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-5 p-6">
        {/* Duration */}
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-content/10">
            <Clock3 size={18} className="text-secondary" />
          </div>

          <div>
            <p className="text-xs text-primary-content/55">Duration</p>

            <p className="font-semibold">
              {trainingProgram?.program.duration} month
            </p>
          </div>
        </div>

        {/* Format */}
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-content/10">
            <GraduationCap size={18} className="text-secondary" />
          </div>

          <div>
            <p className="text-xs text-primary-content/55">Format</p>

            <p className="font-semibold">In person</p>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-2">
          <Link
            href={`/inscription?training=${trainingProgram?.training.id}&program=${trainingProgram?.program.id}`}
            className="btn btn-secondary h-12 w-full border-none font-bold text-primary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            Subscribe to this training
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function EmptyModules() {
  return (
    <div className="rounded-2xl border border-dashed border-primary/20 bg-primary/5 px-6 py-10 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-content">
        <Folder size={26} />
      </div>

      <h3 className="mt-4 font-bold text-primary">Unavailable modules</h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-base-content/60">
        There are currently no modules available for this program. Please check
        back later.
      </p>
    </div>
  );
}
