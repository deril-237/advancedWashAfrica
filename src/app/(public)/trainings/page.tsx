import { GraduationCap } from "lucide-react";
import { Banner } from "../_components/Banners";
import { HomeTrainingList } from "../_components/HomeTrainingList";
import { FadeOut } from "@/components/atoms/FadeOut";

export default function TrainingsListPage() {
  return (
    <div>
      <div className="w-full">
        <Banner icon={GraduationCap}>
          <FadeOut>
            <div className="w-full mx-auto max-w-7xl flex px-6 items-center  h-120">
              <div className="max-w-4xl">
                <h1 className="text-4xl font-black capitalize leading-tight text-base-100 md:text-6xl">
                  Presentation of Our <br />
                  <span className="text-secondary">
                    Different Training Programs
                  </span>
                </h1>

                <p className="max-w-2xl text-lg leading-8 text-base-100/80">
                  Discover all our specialized training programs
                </p>
              </div>
            </div>
          </FadeOut>
        </Banner>
        <HomeTrainingList limit={15} />
      </div>
    </div>
  );
}
