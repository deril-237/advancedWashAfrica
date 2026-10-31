import { Check } from "lucide-react";

const missionList = [
  "Practical exercise",
  "Case studies",
  "Field simulations",
  "Real world project",
];

export function TeachingApproach() {
  return (
    <section className="w-full bg-primary/10 py-14 sm:py-18 md:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div className="flex items-center justify-center">
          <div
            role="img"
            aria-label="70% Theorical and 30% Theorical"
            className="relative aspect-square w-full max-w-xs rounded-full bg-secondary sm:max-w-sm"
          >
            <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,var(--color-primary)_0%_30%,transparent_30%_100%)]" />
            <p className="absolute  bottom-20 left-10 text-center text-lg font-bold text-primary sm:text-xl">
              70% Theorical
            </p>
            <p className="absolute right-[13%] top-[20%] text-center text-base font-bold text-base-100 sm:text-lg">
              30% Theorical
            </p>
          </div>
        </div>
        {/* Texte */}

        <div className="flex flex-col justify-center">
          {/* <span className="badge badge-secondary badge-lg w-fit">
            Notre mission
          </span> */}

          <h2 className="mt-4 text-3xl font-bold text-primary sm:text-4xl">
            Teaching Approach
          </h2>

          <p className="mt-5 text-base leading-7 text-base-content/80 sm:mt-6 sm:text-lg sm:leading-8">
            We provide{" "}
            <strong>practical and career-oriented training in water</strong>,
            sanitation, water quality, and related technical fields.
          </p>
          <div className="mt-6 space-y-3 sm:space-y-4">
            {missionList.map((mission) => (
              <div
                key={mission}
                className="flex items-center rounded-lg bg-primary/10 px-3 py-3 transition hover:-translate-y-1 hover:shadow-md sm:px-4"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-content">
                    <Check size={16} />
                  </div>

                  <p className="text-base font-medium sm:text-lg">{mission}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
