import { TitlePage } from "@/components/atoms/TitlePage";
import { ButtonOpenModal } from "@/components/molecules/modal/ButtonOpenModal";
import { WaveListWithFilter } from "@/features/waves";
import { List, PlusIcon } from "lucide-react";
import { WaveStatistics } from "../../../features/waves/components/WaveStatistics";

export default function WaveListPage() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between flex-wrap gap-2">
        <TitlePage
          title={"Vagues de formation"}
          description="Gerer les vagues de formation ici"
          icon={<List />}
        />
        <ButtonOpenModal
          modal="createWave"
          modalProps={null}
          className="btn btn-success text-base-100"
        >
          <PlusIcon className="size-6" />
          <span>Créer</span>
        </ButtonOpenModal>
      </div>
      <WaveStatistics />
      <WaveListWithFilter />
    </div>
  );
}
