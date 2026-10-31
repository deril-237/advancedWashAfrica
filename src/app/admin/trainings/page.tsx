// app/admin/trainings/page.tsx
import { TitlePage } from "@/components/atoms/TitlePage";
import { GraduationCap, PlusIcon } from "lucide-react";
import { getTrainingListAction, trainingKeys } from "@/features/trainings";
import { getQueryClient } from "@/lib/tanstackQueryClient";
import { TrainingListComponent } from "@/features/trainings";
import { FIRST_PAGE } from "@/lib/pagination";
import { Button } from "@/components/atoms/Button";
import { ButtonOpenModal } from "@/components/molecules";

export default async function TrainingsPage(props: {
  searchParams: Promise<{ page?: string }>;
}) {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: trainingKeys.list({ page: FIRST_PAGE }),
    queryFn: async () => {
      const result = await getTrainingListAction({ page: FIRST_PAGE });

      if (result.serverError) {
        throw new Error(
          result.serverError.global ??
            "Erreur est survenue pendant le chargement des donnée",
        );
      }

      return result.data;
    },
  });

  return (
    <div className="font-sans space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <TitlePage
          title="Formations"
          description="Catalogue des formations proposées et de leurs programmes"
          icon={<GraduationCap size={22} />}
        />
        <ButtonOpenModal
          modal="addTraining"
          modalProps={undefined}
          className="btn btn-soft btn-primary"
        >
          <PlusIcon size={20} />
          Ajouter
        </ButtonOpenModal>
      </div>

      <TrainingListComponent />
    </div>
  );
}
