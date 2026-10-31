"use client";

import { DataTable } from "@/components/molecules/DataTable";
import { FunctionComponent } from "react";
import { Program } from "../types";
import { Column } from "@/components/molecules/Table";
import { PencilIcon } from "lucide-react";
import { useGetProgramList } from "../hooks";
import { ButtonOpenModal } from "@/components/molecules/modal/ButtonOpenModal";
import { ButtonDelete } from "./ButtonDelete";

const columns: Column<Program>[] = [
  {
    key: "duration",
    label: "durée",
    renderCell: (item) => (
      <div className="">
        <span className="badge badge-soft badge-base-100 badge-lg p-2">
          {item.duration} mois
        </span>
      </div>
    ),
  },
  {
    key: "action",
    label: "Action",
    renderCell: (item) => (
      <div className="flex flex-row gap-4">
        {/* <ButtonOpenModal
          className="btn btn-secondary p-2"
          modal="program"
          modalProps={item}
        >
          <PencilIcon className="size-6 text-base-100" />
        </ButtonOpenModal> */}
        <ButtonDelete programId={item.id} />
      </div>
    ),
  },
];

const ProgramMobileView: FunctionComponent<{
  item: Program;
  index: number;
}> = ({ item, index }) => {
  const formatDate = (value: unknown) => {
    if (!value) return "—";

    try {
      return new Date(value as string | number | Date).toLocaleDateString(
        "fr-FR",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        },
      );
    } catch {
      return String(value);
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-base-300 bg-base-200 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-base-content">
            Parcours #{index + 1}
          </p>
          <p className="text-xs text-base-content/70">
            Créé le {formatDate(item.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* <ButtonOpenModal
            className="btn btn-secondary btn-sm p-2"
            modal="program"
            modalProps={item}
          >
            <PencilIcon className="size-4 text-base-100" />
          </ButtonOpenModal> */}
          <ButtonDelete programId={item.id} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="badge badge-soft badge-base-100 badge-lg p-2">
          {item.duration} mois
        </span>
        <span className="text-xs text-base-content/60">
          Mis à jour {formatDate(item.updatedAt)}
        </span>
      </div>
    </div>
  );
};

export const ProgramList: FunctionComponent = () => {
  const { error, data, isLoading } = useGetProgramList();
  return (
    <DataTable
      data={data ?? []}
      columns={columns}
      emptyMessage={error ? error.message : "No programs"}
      isLoading={isLoading}
      mobileView={({ item, index }) => (
        <ProgramMobileView item={item} index={index} />
      )}
    />
  );
};
