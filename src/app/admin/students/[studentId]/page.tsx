import { TitlePage } from "@/components/atoms/TitlePage";
import EmptyState from "@/components/atoms/EmptyState";
import { User, GraduationCap, MessageSquareQuote, Quote } from "lucide-react";
import { ButtonOpenModal } from "@/components/molecules";
import { notFound } from "next/navigation";
import {
  StudentProfileComponent,
  getStudentDetailsAction,
  getStudentDetail,
  MotivationsCard,
} from "@/features/students";
import { STATUS_CONFIG, MODALITY_LABELS } from "@/features/inscriptions";

export type StudentDetails = Awaited<ReturnType<typeof getStudentDetail>>;

export default async function StudentDetailPage(
  props: PageProps<"/admin/students/[studentId]">,
) {
  const { studentId } = await props.params;
  const { data: student } = await getStudentDetailsAction(studentId);

  if (!student) {
    return notFound();
  }

  const fullName = `${student.name} ${student.secondName}`;

  return (
    <div className="font-sans">
      <TitlePage
        title="Détails de l'étudiant"
        description={`Profil, documents et inscriptions de ${fullName}`}
        icon={<User size={22} />}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <StudentProfileComponent student={student} />
        <Inscription student={student} />
      </div>
    </div>
  );
}

const STATUS_BORDER_CLASS: Record<string, string> = {
  ACCEPTED: "border-l-success",
  SUBMITTED: "border-l-warning",
  REJECTED: "border-l-error",
};

export function Inscription({ student }: { student: StudentDetails }) {
  student.motivations;

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Inscriptions */}
      <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading text-base font-semibold flex items-center gap-2 text-primary">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/8 ring-1 ring-primary/10">
              <GraduationCap size={17} />
            </span>
            Inscriptions
          </h3>
          <ButtonOpenModal
            modal="secondInscription"
            className="btn btn-soft btn-primary btn-sm"
            modalProps={{ studentId: student.id }}
          >
            Inscrire
          </ButtonOpenModal>
        </div>

        {student.inscriptions.length === 0 ? (
          <EmptyState
            icon={<GraduationCap size={22} className="text-base-content/40" />}
            title="Aucune inscription"
            description="Cet étudiant n'a encore postulé à aucune formation."
          />
        ) : (
          <div className="space-y-3">
            {student.inscriptions.map((inscription) => {
              const status = STATUS_CONFIG[inscription.status];
              const { training, program } = inscription.wave.trainingProgram;
              const borderClass =
                STATUS_BORDER_CLASS[inscription.status] ?? "border-l-base-300";

              return (
                <div
                  key={inscription.id}
                  className={`rounded-xl rounded-l-none border border-base-300 border-l-4 ${borderClass} bg-base-100 p-4 transition-shadow hover:shadow-sm`}
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className="font-heading font-semibold text-base-content">
                        {training.name}
                      </p>
                      <p className="text-xs text-base-content/50 mt-0.5">
                        {program.duration} mois ·{" "}
                        {MODALITY_LABELS[inscription.modality]}
                      </p>
                    </div>
                    <span
                      className={`badge badge-soft ${status.badgeClass} badge`}
                    >
                      {status.label}
                    </span>
                  </div>
                  {inscription.status === "REJECTED" &&
                    inscription.reasonRejected && (
                      <p className="text-xs text-error/80 mt-3 bg-error/5 rounded-lg px-3 py-2">
                        Motif du rejet : {inscription.reasonRejected}
                      </p>
                    )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <MotivationsCard motivations={student.motivations} />
    </div>
  );
}
