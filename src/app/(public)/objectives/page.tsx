import {
  Target,
  GraduationCap,
  LucideIcon,
  BookOpen,
  BriefcaseBusiness,
  Lightbulb,
  Users,
  Rocket,
  ArrowUpRight,
} from "lucide-react";
import { Banner } from "../_components/Banners";
import Link from "next/link";
import { CallToAction } from "../_components/CallToAction";
import { ObjectiveCardProps, ObjectiveCard } from "./_components/ObjectiveCard";

const objectives: ObjectiveCardProps[] = [
  {
    index: 1,
    icon: GraduationCap,
    title: "Développer les compétences",
    description:
      "Proposer des formations pratiques permettant aux apprenants d'acquérir des compétences solides et adaptées aux exigences du monde professionnel.",
    colSpan: "col-span-2",
    bg: "bg-primary",
  },
  {
    index: 2,
    icon: BookOpen,
    title: "Faciliter l'apprentissage",
    description:
      "Offrir un environnement d'apprentissage accessible, structuré et orienté vers la pratique afin de favoriser la progression de chaque apprenant.",
    colSpan: "col-span-1",
  },
  {
    index: 3,
    icon: BriefcaseBusiness,
    title: "Favoriser l'employabilité",
    description:
      "Préparer les apprenants à intégrer le monde professionnel grâce à des compétences directement mobilisables en entreprise.",
    colSpan: "col-span-1",
  },
  {
    index: 4,
    icon: Lightbulb,
    title: "Encourager l'innovation",
    description:
      "Stimuler la créativité, l'esprit critique et la capacité à résoudre des problèmes à travers des projets et des approches pédagogiques modernes.",
    colSpan: "col-span-1",
  },
  {
    index: 5,
    icon: Users,
    title: "Créer une communauté",
    description:
      "Favoriser les échanges, le partage d'expérience et la collaboration entre apprenants, formateurs et professionnels.",
    colSpan: "col-span-1",
  },
  {
    index: 6,
    icon: Rocket,
    title: "Accompagner la réussite",
    description:
      "Accompagner chaque apprenant dans son parcours afin de l'aider à transformer ses connaissances en véritables opportunités.",
    colSpan: "col-span-2",
    bg: "bg-primary",
  },
];

export default function ObjectivesPage() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero */}
      <TargetBanner />

      {/* Objectives */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <span className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            <span className="h-px w-8 bg-secondary" />
            Notre vision
          </span>

          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Des objectifs pensés pour votre réussite
          </h2>

          <p className="mt-4 text-base leading-7 text-base-content/65">
            Kesmond International University accompagne les apprenants dans le
            développement de compétences concrètes, utiles et adaptées aux
            réalités du monde professionnel.
          </p>
        </div>

        <div className="px-4 pb-20 sm:px-6 lg:px-8">
          <div className="@max-sm:flex @max-sm:flex-col space-y-4 md:grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {objectives.map((objective) => (
              <ObjectiveCard key={objective.index} {...objective} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CallToAction>
        <span className="inline-flex rounded-full bg-secondary/15 px-4 py-2 text-sm font-semibold text-secondary">
          Passez à l'action
        </span>

        <h2 className="mt-5 text-3xl font-bold text-white sm:text-4xl">
          Prêt à développer votre potentiel ?
        </h2>

        <p className="mt-5 text-base leading-7 text-white/70">
          Découvrez nos formations et trouvez le parcours qui correspond à vos
          ambitions professionnelles.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href={"/trainings"}
            className="btn border-none bg-secondary px-6 text-primary hover:bg-secondary/90"
          >
            Découvrir les formations
          </Link>

          <Link
            href={"/contacts"}
            className="btn btn-outline border-white/30 px-6 text-white hover:border-white hover:bg-white hover:text-primary"
          >
            Nous contacter
          </Link>
        </div>
      </CallToAction>
    </div>
  );
}

function TargetBanner() {
  return (
    <Banner icon={Target}>
      <div className="w-full mx-auto max-w-7xl flex px-6 items-center  h-120">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-black capitalize leading-tight text-base-100 md:text-6xl">
            les Objectifs de
            <br />
            <span className="text-secondary">
              nos different programmes formations
            </span>
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-base-100/80">
            Decouvrez toutes nos formations specialisé
          </p>
        </div>
      </div>
    </Banner>
  );
}
