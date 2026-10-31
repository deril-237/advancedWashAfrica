import { SchoolDescribe } from "../_components/SchoolDescribe";
import { SchoolPosition } from "./_components/SchoolPosition";
import { PartnerCarrousel } from "../_components/PartnerCarrousel";
import { Banner } from "../_components/Banners";
import { FadeOut } from "@/components/atoms/FadeOut";
import { GraduationCap } from "lucide-react";
import { Missions } from "../_components/Mission";

export default function AboutUs() {
  return (
    <div className="max-w-7x">
      <Banner icon={GraduationCap}>
        <FadeOut>
          <div className="w-full mx-auto max-w-7xl flex px-6 items-center h-120">
            <div className="max-w-4xl">
              <h1 className="text-4xl font-black capitalize leading-tight text-base-100 md:text-6xl">
                About
                <br />
                <span className="text-blue-300">Advanced Wash Africa</span>
              </h1>

              <p className="max-w-2xl text-lg leading-8 text-base-100/80">
                Discover our mission, vision, and commitment to developing
                skilled professionals and promoting sustainable entrepreneurship
                in Cameroon.
              </p>
            </div>
          </div>
        </FadeOut>
      </Banner>
      <div className="bg-primary/10">
        <SchoolDescribe />
      </div>
      <SchoolPosition />
      <Missions />
      <PartnerCarrousel />
      {/* <Missions /> */}
    </div>
  );
}
