"use client";

import { ArrowRight, FileDown } from "lucide-react";
import Link from "next/link";
import { Banner } from "./Banners";

export function HomeBanner() {
  const onClick = () => {
    const trainingDiv = document.getElementById(`trainings`);

    if (!trainingDiv) {
      throw new Error(`Element with id trainings don't exist`);
    }

    trainingDiv.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <Banner>
      <div className="mx-auto min-h-screen flex items-center w-full max-w-7xl px-6">
        <div className="max-w-3xl space-y-8">
          <h1 className="text-4xl font-black leading-tight text-base-100 md:text-6xl">
            Short <br />
            <span className="text-secondary text-nowrap">
              Certified Training
            </span>
            <br />
            Programs
          </h1>

          <p className="max-w-2xl text-lg leading-8 text-base-100/80">
            Gain practical, industry-relevant skills in water treatment and
            environmental management through short, intensive training programs
            designed for professionals, students, and organizations
          </p>

          <div className="flex flex-wrap gap-4">
            <button className="btn btn-primary rounded-xl" onClick={onClick}>
              Discover our trainings
              <ArrowRight size={18} />
            </button>

            <Link
              href={`/documents/brochure.pdf`}
              download={true}
              className="btn btn-outline border-base-100 text-base-100 hover:bg-base-100 hover:text-primary rounded-xl"
            >
              Download our brochure
              <FileDown size={18} />
            </Link>
          </div>
        </div>
      </div>
    </Banner>
  );
}
