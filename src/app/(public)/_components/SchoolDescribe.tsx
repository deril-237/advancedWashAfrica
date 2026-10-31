import { Check } from "lucide-react";
import Image from "next/image";

export function SchoolDescribe() {
  return (
    <section className="bg-inherit py-18 md:py-24 min-h-3/4 h-3/4">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2">
        {/* Texte */}

        <div className="flex flex-col justify-center">
          <h2 className="mt-4 text-4xl font-bold text-primary">Who we are ?</h2>

          <p className="mt-6 text-lg leading-8 text-base-content/80">
            <span className="font-bold">AVANCED WASH AFRICA</span> is a training
            center operating under the auspices of the <span></span>{" "}
            <Image
              src="/images/partners-logo/minefop.png"
              alt="MINEFOP"
              width={40}
              height={16}
              className="inline-block align-middle"
            />
            <strong>MINEFOP</strong> authorized under Agreement No
            000465/MINEFOP/SG/DFOP/DSGF/CSACD/CBAC of 14 august 2026, our
            training center is committed to developing highly skilled
            technicians and fostering sustainable entrepreneurship in Cameroon.
            Our goal is to train skilled technicians and promote sustainable
            entrepreneurship in the <strong>WASH</strong> sector.
          </p>
        </div>
        {/* Image */}

        <div className="relative mx-auto h-105 w-full max-w-md">
          <div className="absolute inset-0 translate-x-5 translate-y-5 rounded-3xl bg-secondary/20" />

          <Image
            src="/images/image.png"
            alt="Mission"
            fill
            className="rounded-3xl object-cover shadow-2xl"
          />
        </div>
        <h1 className="text-center text-2xl font-bold">Fondator Mr xxxx</h1>
      </div>
    </section>
  );
}
