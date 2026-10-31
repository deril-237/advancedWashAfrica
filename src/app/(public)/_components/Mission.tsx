import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const missionList = [
  "Comprendre Les principes et valeurs des actions humanitaire",
  "Developper l'esprit d'équipe et de coordinaition",
  "Ameloirer la qualité global des responses humanitaire",
];

export function Missions() {
  return (
    <section className="bg-primary/10 py-18 md:py-24">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2">
        {/* Image */}

        <div className="relative mx-auto h-105 w-full max-w-md">
          <div className="absolute inset-0 translate-x-5 translate-y-5 rounded-3xl bg-secondary/20" />

          <Image
            src="/images/objective.jpeg"
            alt="Mission"
            fill
            className="rounded-3xl object-cover shadow-2xl"
          />
        </div>

        {/* Texte */}

        <div className="flex flex-col justify-center">
          <span className="badge badge-secondary badge-lg w-fit">
            Notre mission
          </span>

          <h2 className="mt-4 text-4xl font-bold text-primary">
            Former les leaders humanitaires de demain
          </h2>

          <p className="mt-6 text-lg leading-8 text-base-content/80">
            <strong>Kesmonds International University</strong> propose une
            formation certifiante qui développe les compétences techniques,
            humaines et éthiques nécessaires pour intervenir efficacement dans
            les situations d'urgence.
          </p>

          <div className="mt-4 pl-8 text-xl">
            {missionList.map((mission) => (
              <div
                key={mission}
                className="flex items-center px-2 py-2 rounded-lg bg-base-100 transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex flex-row items-center gap-4">
                  <div className="flex size-4 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-content">
                    <Check size={20} />
                  </div>

                  <p className="font-medium text-lg">{mission}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <Link
              href={"/objectives"}
              className="mt-4 btn btn-secondary text-primary rounded-lg"
            >
              Nos Objectifs
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
