"use client";

import { FunctionComponent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  DataTable,
  MobileVersionProps,
} from "@/components/molecules/DataTable";
import { Column } from "@/components/molecules/Table";
import { Button } from "@/components/atoms/Button";
import { usePagination } from "@/hooks/usePagination";
import { FIRST_PAGE } from "@/lib/pagination";
import { Eye, UserRound, Calendar, GraduationCap } from "lucide-react";
import {
  FilterInscription,
  InscriptionListItem,
  InscriptionStatus,
} from "../types";
import { useGetInscriptionList } from "../hooks";

const STATUS_BADGES: Record<
  InscriptionStatus,
  { label: string; class: string }
> = {
  [InscriptionStatus.SUBMITTED]: { label: "Soumis", class: "badge-warning" },
  [InscriptionStatus.ACCEPTED]: {
    label: "Approuvé",
    class: "badge-success text-success-content",
  },
  [InscriptionStatus.REJECTED]: {
    label: "Rejeté",
    class: "badge-error text-error-content",
  },
  //   [InscriptionStatus.PENDING]: { label: "En attente", class: "badge-info text-info-content" },
};

export const columns: Column<InscriptionListItem>[] = [
  {
    label: "Étudiant",
    key: "student",
    renderCell(inscription) {
      const { student } = inscription;
      return (
        <div className="flex flex-row gap-3 items-center">
          {student.photoFile?.url ? (
            <Image
              src={student.photoFile.url}
              width={40}
              height={40}
              sizes="40px"
              className="size-10 rounded-full object-cover ring-2 ring-base-200 ring-offset-1"
              alt={`Photo de ${student.name}`}
            />
          ) : (
            <div className="size-10 rounded-full bg-base-200 ring-2 ring-base-200 ring-offset-1 flex items-center justify-center shrink-0">
              <UserRound className="size-5 text-base-content/40" />
            </div>
          )}
          <p className="text-base font-semibold text-base-content capitalize leading-tight">
            {student.name} {student.secondName}
          </p>
        </div>
      );
    },
  },
  {
    label: "Formation",
    key: "wave",
    renderCell(inscription) {
      const trainingName = inscription.wave?.trainingProgram?.training?.name;
      return (
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-base-content truncate max-w-200px">
            {trainingName ?? "Non assigné"}
          </p>
          <span className="badge badge-soft badge-neutral text-xs font-mono w-fit">
            {inscription.modality}
          </span>
        </div>
      );
    },
  },
  {
    label: "Statut",
    key: "status",
    renderCell(inscription) {
      const statusInfo = STATUS_BADGES[inscription.status] ?? {
        label: inscription.status,
        class: "badge-neutral",
      };

      return (
        <span
          className={`badge badge-sm badge-soft font-medium ${statusInfo.class}`}
        >
          {statusInfo.label}
        </span>
      );
    },
  },
  {
    label: "Date de demande",
    key: "createdAt",
    renderCell(inscription) {
      return (
        <div className="flex items-center gap-1.5 text-sm text-base-content/80 tabular-nums">
          <Calendar className="size-3.5 text-base-content/40" />
          <span>
            {new Date(inscription.createdAt).toLocaleDateString("fr-FR")}
          </span>
        </div>
      );
    },
  },
  {
    label: "Actions",
    key: "action",
    renderCell(inscription) {
      return (
        <Link href={`/admin/inscriptions/${inscription.id}`}>
          <Button className="btn btn-sm btn-outline btn-primary">
            <Eye className="size-4" />
            Détails
          </Button>
        </Link>
      );
    },
  },
];

const InscriptionMobile: FunctionComponent<
  MobileVersionProps<InscriptionListItem>
> = ({ item: inscription }) => {
  const { student, wave } = inscription;
  const statusInfo = STATUS_BADGES[inscription.status] ?? {
    label: inscription.status,
    class: "badge-neutral",
  };

  return (
    <div className="card bg-base-100+ rounded-lg shadow-md p-4 gap-6 my-1">
      {/* En-tête : Identité et statut */}
      <div className="flex flex-row items-center justify-between gap-3">
        <div className="flex flex-row items-center gap-3">
          {student.photoFile?.url ? (
            <Image
              src={student.photoFile.url}
              width={56}
              height={56}
              sizes="56px"
              className="size-14 rounded-full object-cover ring-2 ring-secondary ring-offset-2 ring-offset-base-100 shrink-0"
              alt={`Photo de ${student.name}`}
            />
          ) : (
            <div className="size-14 rounded-full bg-base-200 ring-2 ring-secondary ring-offset-2 ring-offset-base-100 flex items-center justify-center shrink-0">
              <UserRound className="size-6 text-base-content/40" />
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <p className="font-heading text-base font-semibold text-base-content capitalize truncate leading-tight">
              {student.name} {student.secondName}
            </p>
            <span className="text-sm text-base-content/60 flex items-center gap-1 mt-0.5">
              <Calendar className="size-3" />
              {new Date(inscription.createdAt).toLocaleDateString("fr-FR")}
            </span>
          </div>
        </div>

        <span className={`badge badge-soft shrink-0 ${statusInfo.class}`}>
          {statusInfo.label}
        </span>
      </div>

      {/* Détails de la formation */}
      <div className="flex flex-col gap-1.5 pl-3 border-l-2 border-border ml-1 text-sm">
        <div className="flex items-center gap-2 text-base-content/80">
          <GraduationCap className="size-4 text-base-content/40 shrink-0" />
          <span className="font-medium truncate">
            {wave?.trainingProgram?.training?.name ?? "Formation inconnue"}
          </span>
        </div>
        <div className="flex items-center justify-between text-base-content/60">
          <span>
            Modalité :{" "}
            <strong className="text-base-content">
              {inscription.modality}
            </strong>
          </span>
        </div>
      </div>

      {/* Action */}
      <Link href={`/admin/inscriptions/${inscription.id}`} className="w-full">
        <Button className="btn btn-primary btn-md w-full text-primary-content">
          <Eye className="size-5" />
          Voir les détails
        </Button>
      </Link>
    </div>
  );
};

const InscriptionMobileSkeleton: FunctionComponent = () => {
  return (
    <div className="card bg-base-100 rounded-lg shadow-md p-4 gap-6 my-1 animate-pulse">
      {/* En-tête */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          {/* Avatar */}
          <div className="skeleton size-14 rounded-full shrink-0" />

          {/* Nom + date */}
          <div className="flex flex-col gap-2 flex-1">
            <div className="skeleton h-5 w-40 max-w-full" />
            <div className="skeleton h-3 w-24" />
          </div>
        </div>

        {/* Badge */}
        <div className="skeleton h-7 w-20 rounded-full shrink-0" />
      </div>

      {/* Informations formation */}
      <div className="flex flex-col gap-3 border-l-2 border-base-200 pl-3 ml-1">
        <div className="flex items-center gap-2">
          <div className="skeleton size-4 rounded" />
          <div className="skeleton h-4 flex-1" />
        </div>

        <div className="flex items-center justify-between">
          <div className="skeleton h-4 w-36" />
          <div className="skeleton h-4 w-20" />
        </div>
      </div>

      {/* Bouton */}
      <div className="skeleton h-12 w-full rounded-lg" />
    </div>
  );
};

export const InscriptionListComponent: FunctionComponent<FilterInscription> = (
  filter,
) => {
  const [page, setPage] = useState(FIRST_PAGE);
  const {
    error,
    isFetching,
    data: inscriptionList,
  } = useGetInscriptionList(page, filter);

  const pagination = usePagination({
    total: inscriptionList?.meta.totalItems ?? 0,
    page,
    onPageChange: setPage,
  });

  return (
    <DataTable
      columns={columns}
      data={inscriptionList?.rows ?? []}
      mobileView={(props) => <InscriptionMobile {...props} />}
      isLoading={isFetching}
      emptyMessage={
        error
          ? "Erreur lors du chargement des inscriptions. Vérifiez votre connexion internet."
          : "Aucune inscription trouvée"
      }
      pagination={pagination}
      mobileLoadingComponent={
        <>
          {Array.from({ length: 4 }).map((_, index) => (
            <InscriptionMobileSkeleton key={index} />
          ))}
        </>
      }
    />
  );
};
