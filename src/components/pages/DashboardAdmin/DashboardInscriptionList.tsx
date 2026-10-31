import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { UserIcon, ArrowRight } from "lucide-react";
import { unwrap } from "@/lib/safeAction";
import { InscriptionStatus } from "@/features/students";
import { getInscriptionListAction } from "@/features/inscriptions";

export function DashboardInscriptionListSkeleton() {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="h-6 w-48 rounded bg-base-200 animate-pulse" />
        <div className="h-4 w-16 rounded bg-base-200 animate-pulse" />
      </div>

      <ul className="list bg-base-100 rounded-box shadow-md">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="list-row items-center">
            <div className="size-10 rounded-full bg-base-200 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 rounded bg-base-200 animate-pulse" />
              <div className="h-3 w-28 rounded bg-base-200 animate-pulse" />
            </div>
            <div className="h-5 w-16 rounded-full bg-base-200 animate-pulse" />
          </li>
        ))}
      </ul>
    </div>
  );
}

const statusConfig: Record<
  InscriptionStatus,
  { label: string; badgeClass: string }
> = {
  SUBMITTED: { label: "En attente", badgeClass: "badge-warning" },
  ACCEPTED: { label: "Accepté", badgeClass: "badge-success" },
  REJECTED: { label: "Rejeté", badgeClass: "badge-error" },
};

function timeAgo(date: Date) {
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `il y a ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `il y a ${diffH} h`;
  const diffDays = Math.floor(diffH / 24);
  return `il y a ${diffDays} j`;
}

async function DashboardInscriptionListContent() {
  const { rows: inscriptions } = await unwrap(
    getInscriptionListAction({ page: 1, limit: 5 }, {}),
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-semibold text-lg">Dossiers récemment soumis</h1>
        <Link
          href="/admin/inscriptions"
          className="text-sm text-primary flex items-center gap-1 hover:underline"
        >
          Voir tout <ArrowRight size={14} />
        </Link>
      </div>

      <ul className="list bg-base-100 rounded-box shadow-md">
        {inscriptions.length === 0 && (
          <li className="list-row p-6 text-center text-base-content/60">
            Aucun dossier soumis récemment
          </li>
        )}

        {inscriptions.map((inscription) => {
          const status = statusConfig[inscription.status];
          const photoUrl = inscription.student.photoFile?.url;

          return (
            <li
              key={inscription.id}
              className="list-row items-center group-hover:-translate-y-2 duration-300"
            >
              <div className="avatar">
                <div className="size-10 rounded-full bg-base-200">
                  {photoUrl ? (
                    <Image
                      src={photoUrl}
                      alt={`${inscription.student.name} ${inscription.student.secondName}`}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <UserIcon size={18} className="text-base-content/40" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 items-center flex-1">
                <div className="">
                  <p className="font-medium">
                    {inscription.student.name} {inscription.student.secondName}
                  </p>
                  <p className="text-sm text-base-content/60">
                    {inscription.wave.trainingProgram.training.name} ·{" "}
                    {timeAgo(inscription.createdAt)}
                  </p>
                </div>
                <span className={`badge badge-soft ${status.badgeClass}`}>
                  {status.label}
                </span>
              </div>
              <Link
                href={`/admin/inscriptions/${inscription.id}`}
                className="btn btn-sm btn-info btn-soft hover:text-white"
              >
                Consulter
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function DashboardInscriptionList() {
  return (
    <Suspense fallback={<DashboardInscriptionListSkeleton />}>
      <DashboardInscriptionListContent />
    </Suspense>
  );
}
