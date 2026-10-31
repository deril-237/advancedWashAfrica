// app/admin/trainings/[trainingId]/page.tsx
import { TitlePage } from "@/components/atoms/TitlePage";
import { GraduationCap } from "lucide-react";
import { TrainingDetail } from "@/features/trainings";

export default async function TrainingDetailPage(props: {
  params: Promise<{ trainingId: string }>;
}) {
  const { trainingId } = await props.params;

  return (
    <div className="font-sans space-y-6">
      <TitlePage
        title="Détail de la formation"
        description="Informations générales et programmes associés"
        icon={<GraduationCap size={22} />}
      />
      <TrainingDetail trainingId={trainingId} />
    </div>
  );
}
