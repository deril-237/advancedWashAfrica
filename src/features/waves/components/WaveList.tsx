"use client";

import { FunctionComponent } from "react";
import { FilterWave, Wave, WaveItemList } from "../types";
import { ButtonOpenModal, DataTable } from "@/components/molecules";
import { useGetWaveList } from "../hooks";
import { Column } from "@/components/molecules/Table";
import {
  CalendarDays,
  PencilIcon,
  Users,
  Banknote,
  CircleCheck,
  CircleX,
} from "lucide-react";
import {
  ButtonLockCourseWave,
  ButtonUnlockCourseWave,
} from "./ButtonChangeStatusWave";

const columns: Column<WaveItemList>[] = [
  {
    key: "startDate",
    label: "Début",
    renderCell: (wave) => (
      <div className="flex bad-center">
        <p className="badge badge-soft badge-success">
          {wave.startDate.toLocaleDateString()}
        </p>
      </div>
    ),
  },
  {
    key: "quota",
    label: "Quota",
    renderCell: (wave) => (
      <div className="flex justify-center">
        <p className="text-secondary">{wave.quota}</p>
      </div>
    ),
  },
  {
    key: "price",
    label: "Prix",
    renderCell: (wave) => (
      <div className="flex justify-center">
        <p className="text-blue-700">{wave.price} XAF</p>
      </div>
    ),
  },
  {
    key: "status",
    label: "Status",
    renderCell: (wave) => (
      <div className="text-nowrap">
        {wave.status === "FINISHED" ? (
          <p className="badge badge-soft badge-error">Terminé</p>
        ) : (
          <p className="badge badge-soft">En cours</p>
        )}
      </div>
    ),
  },
  {
    key: "Parcours",
    label: "Status",
    renderCell: (wave) => (
      <div className="text-nowrap">
        {wave.trainingProgram.training.name}
        <br />
        {wave.trainingProgram.program.duration} mois
      </div>
    ),
  },
  {
    key: "actions",
    label: "Actions",
    renderCell: (wave) => (
      <div>
        {wave.status === "FINISHED" ? (
          <ButtonUnlockCourseWave waveId={wave.id} />
        ) : (
          <div className="flex gap-4">
            <ButtonOpenModal
              className="btn btn-sm btn-secondary"
              modal="updateWave"
              modalProps={wave}
              dataTip={"modifier"}
            >
              <PencilIcon className="size-6 text-base-200" />
              Modifier
            </ButtonOpenModal>
            <ButtonLockCourseWave waveId={wave.id} />
          </div>
        )}
      </div>
    ),
  },
];

const WaveMobile: FunctionComponent<{ item: Wave; index: number }> = ({
  item,
  index,
}) => {
  return (
    <div className="card border border-base-300 bg-base-200 shadow-sm">
      <div className="card-body gap-4 p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-primary">Vague {index + 1}</h3>

          {item.status === "FINISHED" ? (
            <span className="badge badge-error badge-soft gap-1">
              <CircleX className="size-3" />
              Terminée
            </span>
          ) : (
            <span className="badge badge-success badge-soft gap-1">
              <CircleCheck className="size-3" />
              En cours
            </span>
          )}
        </div>

        {/* Informations */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-base-content/70">
              <CalendarDays className="size-4 text-success" />
              <span>Début</span>
            </div>

            <span className="badge badge-success badge-soft">
              {item.startDate.toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-base-content/70">
              <Users className="size-4 text-secondary" />
              <span>Quota</span>
            </div>

            <span className="font-semibold text-secondary">{item.quota}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-base-content/70">
              <Banknote className="size-4 text-info" />
              <span>Prix</span>
            </div>

            <span className="font-semibold text-info">
              {item.price.toLocaleString()} XAF
            </span>
          </div>
        </div>

        <div className="divider my-0" />

        {/* Actions */}
        <div className="flex justify-end gap-2">
          {item.status === "FINISHED" ? (
            <ButtonUnlockCourseWave waveId={item.id} />
          ) : (
            <>
              <ButtonOpenModal
                modal="updateWave"
                modalProps={item}
                className="btn btn-sm btn-secondary"
                dataTip="Modifier vague"
              >
                <PencilIcon className="size-5" />
                Modifier
              </ButtonOpenModal>

              <ButtonLockCourseWave waveId={item.id} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const WaveListComponent: FunctionComponent<FilterWave> = ({
  ...filter
}) => {
  const { data: waveList, isFetching, error } = useGetWaveList(filter);
  return (
    <DataTable
      data={waveList ?? []}
      emptyMessage={error?.message ?? "Aucune vague pour le moment"}
      columns={columns}
      isLoading={isFetching}
      mobileView={({ item, index }) => <WaveMobile item={item} index={index} />}
    />
  );
};
