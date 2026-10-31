import { HomeBanner } from "./_components/HomeBanner";
import { Missions } from "./_components/Mission";
import { StatisticsSection } from "./_components/StatisticsSection";
import { HomeTrainingList } from "./_components/HomeTrainingList";
import Link from "next/link";
import { CallToAction } from "./_components/CallToAction";
import { SchoolDescribe } from "./_components/SchoolDescribe";
import { TeachingApproach } from "./_components/TeachingApproach";
import { PartnerCarrousel } from "./_components/PartnerCarrousel";
import { FadeOut } from "@/components/atoms/FadeOut";

export default function Page() {
  return (
    <>
      <div className="">
        <HomeBanner />
      </div>
      {/* <Missions /> */}
      <FadeOut>
        <SchoolDescribe />
      </FadeOut>
      <FadeOut>
        <TeachingApproach />
      </FadeOut>
      <HomeTrainingList displayTitle={true} />
      <StatisticsSection />
      {/* <PartnerCarrousel /> */}
      <FadeOut>
        <div className="my-16">
          <CallToActionHome />
        </div>
      </FadeOut>
    </>
  );
}

export function CallToActionHome() {
  return (
    <CallToAction>
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">
        Your future starts here
      </span>

      <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
        Develop your skills and prepare your professional future.
      </h2>

      <p className="mt-4 text-base leading-7 text-white/65">
        Discover our training programs and find the path that suits your goals.
      </p>

      <Link
        href="/trainings"
        className="btn btn-secondary mt-8 rounded-xl border-none px-7 font-bold text-primary"
      >
        Discover our training programs
      </Link>
    </CallToAction>
  );
}
