import { Partners } from "../partners";
import Image from "next/image";

export function PartnerCarrousel() {
  if (Partners.length === 0) return null;

  return (
    <section
      aria-labelledby="partners-heading"
      className="flex flex-col items-center gap-8 overflow-hidden bg-primary py-12 sm:py-16"
    >
      <div className="px-4 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
          Together, Our go Together, we go further.
        </p>
        <h2
          id="partners-heading"
          className="font-heading text-3xl font-bold text-primary-content sm:text-4xl"
        >
          Our Partners
        </h2>
      </div>

      <div
        aria-label="Logos of partner"
        className="partners-viewport relative w-full overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
        role="region"
        tabIndex={0}
      >
        <div className="animate-partners flex w-max">
          {[false, true].map((isDuplicate) => (
            <ul
              key={isDuplicate ? "duplicate" : "original"}
              aria-hidden={isDuplicate}
              className="flex w-max min-w-[100vw] shrink-0 items-center justify-around gap-5 px-3"
            >
              {Partners.map((partner) => (
                <li
                  key={partner.name}
                  className="flex h-24 w-36 shrink-0 items-center justify-center rounded-xl border border-white/70 bg-base-100 p-5 shadow-lg shadow-black/10 transition-transform duration-300 hover:-translate-y-1 sm:w-44"
                >
                  <Image
                    src={partner.logo}
                    alt={isDuplicate ? "" : `${partner.name} logo`}
                    width={240}
                    height={160}
                    className="max-h-16 max-w-full object-contain"
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
