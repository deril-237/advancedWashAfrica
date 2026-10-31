import { Button } from "@/components/atoms/Button";
import { TitlePage } from "@/components/atoms/TitlePage";
import { ProgramList } from "@/features/programs/components";
import { ButtonOpenModal } from "@/components/molecules/modal/ButtonOpenModal";
import { List, PlusIcon } from "lucide-react";

export default function Program() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between flex-wrap gap-2">
        <TitlePage
          title={"Programs"}
          description="Gerer les programs de formation ici"
          icon={<List />}
        />
        <ButtonOpenModal
          modal="program"
          modalProps={null}
          className="btn btn-primary text-base-100"
        >
          <PlusIcon className="size-6" />
          <span> Ajouter</span>
        </ButtonOpenModal>
      </div>
      <ProgramList />
    </div>
  );
}
