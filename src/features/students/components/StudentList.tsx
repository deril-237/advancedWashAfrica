"use client";

import { FunctionComponent, useState } from "react";
import { FilterStudent, StudentListItem } from "../types";
import { Column } from "@/components/molecules/Table";
import { useGetStudentList } from "../hooks";
import { usePagination } from "@/hooks/usePagination";
import Image from "next/image";
import { User, Phone, Mail, Eye, UserRound } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import {
  DataTable,
  MobileVersionProps,
} from "@/components/molecules/DataTable";
import { FIRST_PAGE } from "@/lib/pagination";

export type StudentListProps = FilterStudent & { name?: string };

const columns: Column<StudentListItem>[] = [
  {
    label: "N° CNI / Passport",
    key: "cniPassport",
    renderCell(student) {
      return (
        <span
          className="badge badge-soft badge-neutral font-mono tabular-nums text-xs"
          title={student.numCNIPassport}
        >
          {student.numCNIPassport}
        </span>
      );
    },
  },
  {
    label: (
      <div className="flex flex-row items-center gap-2">
        <User className="size-4" />
        <span>Nom</span>
      </div>
    ),
    key: "student",
    renderCell(student) {
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
    label: "Contact",
    key: "contact",
    renderCell(student) {
      return (
        <div className="flex flex-col gap-1.5 max-w-220px">
          <div className="flex flex-row items-center gap-2">
            <span className="flex items-center justify-center rounded-full bg-success/10 p-1 shrink-0">
              <Phone className="size-3.5 text-success" />
            </span>
            <p className="text-sm text-base-content/80 tabular-nums truncate">
              {student.phone}
            </p>
          </div>
          <div className="flex flex-row items-center gap-2">
            <span className="flex items-center justify-center rounded-full bg-error/10 p-1 shrink-0">
              <Mail className="size-3.5 text-error" />
            </span>
            <p
              className="text-sm text-base-content/80 truncate"
              title={student.email}
            >
              {student.email}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    label: "Actions",
    key: "action",
    renderCell(student) {
      return (
        <Link href={`/admin/students/${student.id}`}>
          <Button className="btn btn-sm btn-outline btn-primary">
            <Eye className="size-4" />
            Détails
          </Button>
        </Link>
      );
    },
  },
];

const StudentMobile: FunctionComponent<MobileVersionProps<StudentListItem>> = ({
  item: student,
}) => {
  return (
    <div className="card bg-base-100 rounded-lg shadow-sm p-4 gap-4">
      {/* Header : identité */}
      <div className="flex flex-row items-center gap-4">
        {student.photoFile?.url ? (
          <Image
            src={student.photoFile.url}
            width={64}
            height={64}
            sizes="64px"
            className="size-16 rounded-full object-cover ring-2 ring-secondary ring-offset-2 ring-offset-base-100 shrink-0"
            alt={`Photo de ${student.name}`}
          />
        ) : (
          <div className="size-16 rounded-full bg-base-200 ring-2 ring-secondary ring-offset-2 ring-offset-base-100 flex items-center justify-center shrink-0">
            <UserRound className="size-7 text-base-content/40" />
          </div>
        )}
        <div className="flex flex-col min-w-0 gap-1">
          <p className="font-heading text-lg font-semibold text-base-content capitalize truncate leading-tight">
            {student.name} {student.secondName}
          </p>
          <span
            className="badge badge-soft badge-neutral font-mono tabular-nums text-xs"
            title={student.numCNIPassport}
          >
            {student.numCNIPassport}
          </span>
        </div>
      </div>

      {/* Corps : contact */}
      <div className="flex flex-col gap-2 pl-4 border-l-2 border-border ml-1">
        <div className="flex items-center gap-2.5">
          <Phone className="size-4 text-base-content/40 shrink-0" />
          <p className="text-base text-base-content/80 tabular-nums truncate">
            {student.phone}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Mail className="size-4 text-base-content/40 shrink-0" />
          <p
            className="text-base text-base-content/80 truncate"
            title={student.email}
          >
            {student.email}
          </p>
        </div>
      </div>

      {/* Pied : action — accent de marque réservé à la CTA principale */}
      <Link href={`/admin/students/${student.id}`} className="w-full">
        <Button className="btn btn-primary btn-md w-full text-primary-content">
          <Eye className="size-5" />
          Voir les détails
        </Button>
      </Link>
    </div>
  );
};

export const StudentListComponent: FunctionComponent<StudentListProps> = ({
  waveId,
  name,
  search,
}) => {
  const [page, setPage] = useState(FIRST_PAGE);

  const {
    error,
    isFetching,
    data: studentList,
  } = useGetStudentList(page, { waveId, search });

  const pagination = usePagination({
    total: studentList?.meta.totalItems ?? 0,
    page,
    onPageChange: setPage,
  });

  return (
    <DataTable
      columns={columns}
      data={studentList?.rows ?? []}
      mobileView={(props) => <StudentMobile {...props} />}
      isLoading={isFetching}
      emptyMessage={
        error
          ? "Erreur lors du chargement des donnée. Verifiez votre connexion internet ou contacté le département d'IT"
          : "Aucun étudiant inscrit"
      }
      pagination={pagination}
    />
  );
};
