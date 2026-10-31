"use client";

import dynamic from "next/dynamic";

const CompanyMap = dynamic(() => import("./CompanyMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-100 animate-pulse rounded-xl" />
  ),
});

export function SchoolPosition() {
  return (
    <section className="bg-base-100 py-18 md:py-24 min-h-3/4 h-3/4">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2">
        <div className="relative mx-auto h-105 w-full max-w-md">
          <div className="absolute inset-0 translate-x-5 translate-y-5 rounded-3xl bg-secondary/20" />
          <CompanyMap />
        </div>

        {/* Texte */}

        <div className="flex flex-col justify-center">
          <h2 className="mt-4 text-4xl font-bold text-primary">
            Where we are ?
          </h2>

          <p className="mt-6 text-lg leading-8 text-base-content/80">
            <span className="font-bold">AVANCED WASH AFRICA</span> is a training
            center operating under the auspices of the NGO RDWB. Our goal is to
            train skilled technicians and promote sustainable entrepreneurship
            in the <strong>WASH</strong> sector.
          </p>
        </div>
      </div>
    </section>
  );
}
