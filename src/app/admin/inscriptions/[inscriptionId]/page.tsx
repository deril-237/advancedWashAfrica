import { notFound } from "next/navigation";
import { ClipboardList } from "lucide-react";
import { TitlePage } from "@/components/atoms/TitlePage";
import { StudentProfileComponent, MotivationsCard } from "@/features/students";
import {
  getInscriptionDetailsAction,
  InscriptionInfoCard,
} from "@/features/inscriptions";

export default async function InscriptionDetailPage(
  props: PageProps<"/admin/inscriptions/[inscriptionId]">,
) {
  const { inscriptionId } = await props.params;
  const result = await getInscriptionDetailsAction(inscriptionId);
  const inscription = result?.data;

  if (!inscription) {
    return notFound();
  }

  const { student, wave } = inscription;
  const fullName = `${student.name} ${student.secondName}`;

  return (
    <div className="font-sans">
      <TitlePage
        title="Détails de l'inscription"
        description={`Dossier de ${fullName} — ${wave.trainingProgram.training.name}`}
        icon={<ClipboardList size={22} />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <StudentProfileComponent student={student} />

        <div className="lg:col-span-2 space-y-6">
          <InscriptionInfoCard inscription={inscription} />
          <MotivationsCard motivations={student.motivations} />
        </div>
      </div>
    </div>
  );
}
