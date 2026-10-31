"use client";

import { FunctionComponent } from "react";
import {
  PencilIcon,
  Trash2Icon,
  PlusIcon,
  LayersIcon,
  Bug,
} from "lucide-react";
import { useDeleteModule, useGetModuleList } from "../hooks";
import { ButtonOpenModal } from "@/components/molecules/modal/ButtonOpenModal";
import { Identifier } from "@/interfaces/entities";
import { Button } from "@/components/atoms/Button";
import { Module } from "../types";
import EmptyState from "@/components/atoms/EmptyState";
import { useMessagePopup } from "@/store/useModalStore";
import { toast } from "react-toastify";

type ModuleListProps = { trainingProgramId: Identifier };
type ModuleItemProps = { module: Module };

export const ModuleItem: FunctionComponent<ModuleItemProps> = ({ module }) => {
  const { mutateAsync: deleteModule, isPending } = useDeleteModule();
  const { openConfirm } = useMessagePopup();

  const handleDelete = () => {
    openConfirm({
      title: "Confirmation de la suppression d'un module",
      type: "danger",
      message: "souhaitez vraiment supprimer ce module ?",
      confirmText: "Ok",
      cancelText: "Annuler",
      showBtnCancel: true,
      onConfirm: async () => {
        try {
          await deleteModule(module.id);
          toast.success("Le module a été supprimer avec success", {
            position: "top-center",
          });
        } catch (error) {
          openConfirm({
            title: "Echec de la suppression",
            type: "danger",
            message:
              "La suppression du module à echouer. Veillez ressayer ou contacter le departement d'IT",
            confirmText: "Ok",
          });
        }
      },
    });
  };

  return (
    <li className="group flex items-start gap-4 rounded-lg border border-base-300 bg-base-100 p-4 transition-colors hover:border-primary/30 hover:bg-base-200/40">
      <div className="flex items-center justify-center size-9 shrink-0 rounded-full bg-primary text-primary-content font-heading font-semibold text-sm">
        {module.position}
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="font-heading font-semibold text-primary truncate">
          {module.name}
        </h2>
        <p className="text-sm text-base-content/60 leading-relaxed mt-0.5">
          {module.description}
        </p>
      </div>

      <div className="flex gap-1.5 shrink-0 opacity-60 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        <ButtonOpenModal
          modal="formModule"
          modalProps={{
            module,
            type: "update",
            trainingProgramId: undefined,
          }}
          className="btn btn-circle btn-soft text-secondary-content bg-secondary/10 hover:bg-secondary/20"
          disabled={isPending}
          title="Modifier le module"
        >
          <PencilIcon className="size-4" />
        </ButtonOpenModal>
        <Button
          className="btn btn-circ text-error hover:bg-error/10"
          onClick={handleDelete}
          disabled={isPending}
          title="Supprimer le module"
        >
          {isPending ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            <Trash2Icon className="size-4" />
          )}
        </Button>
      </div>
    </li>
  );
};

const ModuleListSkeleton = () => (
  <ul className="space-y-3">
    {Array.from({ length: 4 }).map((_, index) => (
      <li
        key={index}
        className="flex items-center gap-4 rounded-lg border border-base-300 bg-base-100 p-4"
      >
        <div className="skeleton size-9 rounded-full shrink-0"></div>
        <div className="flex flex-col gap-2 flex-1">
          <div className="skeleton h-4 w-40"></div>
          <div className="skeleton h-3 w-full max-w-md"></div>
        </div>
      </li>
    ))}
  </ul>
);

export const ModuleList: FunctionComponent<ModuleListProps> = ({
  trainingProgramId,
}) => {
  const { error, data, isLoading } = useGetModuleList(trainingProgramId);

  return (
    <div className="rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-base font-semibold flex items-center gap-2">
          <LayersIcon size={18} className="text-primary" />
          Modules
          {!isLoading && data && (
            <span className="badge badge-soft badge-primary badge-sm">
              {data.length}
            </span>
          )}
        </h3>

        <ButtonOpenModal
          modal="formModule"
          modalProps={{
            type: "add",
            trainingProgramId,
          }}
          className="btn btn-soft btn-primary btn-sm"
        >
          <PlusIcon className="size-4" />
          Ajouter un module
        </ButtonOpenModal>
      </div>

      {error ? (
        <EmptyState
          icon={<Bug size={22} className="text-error/40" />}
          title="Aucun module"
          description={error.message}
        />
      ) : isLoading ? (
        <ModuleListSkeleton />
      ) : data && data.length === 0 ? (
        <EmptyState
          icon={<LayersIcon size={22} className="text-base-content/40" />}
          title="Aucun module"
          description="Ce programme de formation ne contient encore aucun module."
        />
      ) : (
        <ul className="space-y-3">
          {data?.map((module) => (
            <ModuleItem key={module.id} module={module} />
          ))}
        </ul>
      )}
    </div>
  );
};
