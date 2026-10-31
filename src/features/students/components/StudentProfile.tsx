import { getStudentDetail } from "../services";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  IdCard,
  Download,
  Eye,
  Home,
  UserPenIcon,
} from "lucide-react";
import InfoRow from "./InfoRow";
import Image from "next/image";
import { ButtonOpenModal } from "@/components/molecules";
import { ServerFileAsset } from "@/features/fileAssets/components/ServerFileAsset";

export type StudentDetails = Awaited<ReturnType<typeof getStudentDetail>>;

export function StudentProfileComponent({
  student,
  updateProfile,
}: {
  student: Omit<StudentDetails, "inscriptions" | "motivations">;
  updateProfile?: boolean;
}) {
  const fullName = `${student.name} ${student.secondName}`;

  const documents = [
    {
      label: "Photo d'identité",
      file: student.photoFile,
      icon: <User size={18} />,
    },
    {
      label: "Diplôme",
      file: student.diplomaFile,
      icon: <FileText size={18} />,
    },
    {
      label: "CNI / Passeport",
      file: student.cniPassportFile,
      icon: <IdCard size={18} />,
    },
  ];

  return (
    <div className="lg:col-span-1 space-y-6">
      {/* Carte identité — style "carte d'étudiant / dossier officiel" */}
      <div className="rounded-2xl border border-base-300 bg-base-100 shadow-sm overflow-hidden">
        {/* Bandeau institutionnel */}
        <div className="relative bg-primary px-6 pt-8 pb-14">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-secondary" />
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-primary-content/10 ring-4 ring-secondary/70 mb-4">
              {student.photoFile ? (
                <ServerFileAsset
                  fileAsset={student.photoFile}
                  render={(url) => (
                    <Image
                      src={url}
                      alt={fullName}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  )}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary-content/40">
                  <User size={32} />
                </div>
              )}
            </div>
            <h2 className="font-heading text-xl font-semibold text-primary-content">
              {fullName}
            </h2>
            <p className="text-sm text-primary-content/70">{student.email}</p>
          </div>
        </div>

        {/* Infos */}
        <div className="px-6 pt-5 pb-6 divide-y divide-base-300">
          <InfoRow
            icon={<Mail size={16} />}
            label="Email"
            value={student.email}
          />
          <InfoRow
            icon={<Phone size={16} />}
            label="Téléphone"
            value={student.phone}
          />
          <InfoRow
            icon={<Calendar size={16} />}
            label="Date de naissance"
            value={new Date(student.birthDate).toLocaleDateString("fr-FR")}
          />
          <InfoRow
            icon={<MapPin size={16} />}
            label="Lieu de naissance"
            value={student.birthPlace}
          />
          <InfoRow
            icon={<Home size={16} />}
            label="Résidence"
            value={student.residence}
          />
          <InfoRow
            icon={<IdCard size={16} />}
            label="N° CNI / Passeport"
            value={student.numCNIPassport}
          />
        </div>

        {updateProfile && (
          <div className="px-6 pb-6">
            <ButtonOpenModal
              modal="updateStudentInfo"
              modalProps={{ studentId: student.id, defaultValues: student }}
              className="btn btn-primary btn-soft w-full"
            >
              <UserPenIcon className="size-5" />
              Modifier les informations
            </ButtonOpenModal>
          </div>
        )}
      </div>

      {/* Documents */}
      <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
        <h3 className="font-heading text-base font-semibold mb-4 text-primary">
          Pièces du dossier
        </h3>
        <div className="space-y-2.5">
          {documents.map((doc) => (
            <div
              key={doc.label}
              className="flex items-center justify-between gap-3 rounded-xl border border-base-300 px-3 py-2.5 transition-colors hover:border-primary/30 hover:bg-base-200/40"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/8 text-primary shrink-0 ring-1 ring-primary/10">
                  {doc.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{doc.label}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <ServerFileAsset
                  fileAsset={doc.file}
                  render={(url) => (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost btn-xs btn-circle hover:text-primary"
                      title="Voir"
                    >
                      <Eye size={15} />
                    </a>
                  )}
                />

                <ServerFileAsset
                  fileAsset={doc.file}
                  render={(url) => (
                    <a
                      href={url}
                      download={`${fullName}-${doc.label}`}
                      className="btn btn-ghost btn-xs btn-circle hover:text-primary"
                      title="Télécharger"
                    >
                      <Download size={15} />
                    </a>
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
