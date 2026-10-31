"use client";

import { FunctionComponent } from "react";
import {
  PencilIcon,
  Trash2Icon,
  PlusIcon,
  BriefcaseIcon,
  Bug,
} from "lucide-react";
import { useDeleteCarrerOpportunity, useGetCarrerOpportunityList } from "../hooks";
import { ButtonOpenModal } from "@/components/molecules/modal/ButtonOpenModal";
import { Identifier } from "@/interfaces/entities";
import { Button } from "@/components/atoms/Button";
import { CarrerOpportunity } from "@/lib/generated/prisma/client";
import EmptyState from "@/components/atoms/EmptyState";
import { useMessagePopup } from "@/store/useModalStore";
import { toast } from "react-toastify";

type CarrerOpportunityListProps = { trainingProgramId: Identifier };
type CarrerOpportunityItemProps = { carrerOpportunity: CarrerOpportunity };

export const CarrerOpportunityItem: FunctionComponent<CarrerOpportunityItemProps> = ({
  carrerOpportunity,
}) => {
  const { mutateAsync: deleteCarrerOpportunity, isPending } = useDeleteCarrerOpportunity();
  const { openConfirm } = useMessagePopup();

  const handleDelete = () => {
    openConfirm({
      title: "Confirmation de la suppression",
      type: "danger",
      message: "Souhaitez-vous vraiment supprimer cette opportunité de carrière ?",
      confirmText: "Ok",
      cancelText: "Annuler",
      showBtnCancel: true,
      onConfirm: async () => {
        try {
          await deleteCarrerOpportunity(carrerOpportunity.id);
          toast.success("L'opportunité a été supprimée avec succès", {
            position: "top-center",
          });
        } catch {
          openConfirm({
            title: "Échec de la suppression",
            type: "danger",
            message:
              "La suppression a échoué. Veuillez réessayer ou contacter le département IT.",
            confirmText: "Ok",
          });
        }
      },
    });
  };

  return (
    <li className="group flex items-center gap-4 rounded-lg border border-base-300 bg-base-100 p-4 transition-colors hover:border-primary/30 hover:bg-base-200/40">
      <div className="flex items-center justify-center size-9 shrink-0 rounded-full bg-primary/10 text-primary">
        <BriefcaseIcon size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="font-heading font-semibold text-base-content truncate">
          {carrerOpportunity.label}
        </h2>
      </div>

      <div className="flex gap-1.5 shrink-0 opacity-60 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        <ButtonOpenModal
          modal="formCarrerOpportunity"
          modalProps={{
            carrerOpportunity,
            type: "update",
            trainingProgramId: undefined,
          }}
          className="btn btn-circle btn-soft text-secondary-content bg-secondary/10 hover:bg-secondary/20"
          disabled={isPending}
          title="Modifier l'opportunité"
        >
          <PencilIcon className="size-4" />
        </ButtonOpenModal>
        <Button
          className="btn btn-circ text-error hover:bg-error/10"
          onClick={handleDelete}
          disabled={isPending}
          title="Supprimer l'opportunité"
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

const CarrerOpportunityListSkeleton = () => (
  <ul className="space-y-3">
    {Array.from({ length: 3 }).map((_, index) => (
      <li
        key={index}
        className="flex items-center gap-4 rounded-lg border border-base-300 bg-base-100 p-4"
      >
        <div className="skeleton size-9 rounded-full shrink-0"></div>
        <div className="flex flex-col gap-2 flex-1">
          <div className="skeleton h-4 w-40"></div>
        </div>
      </li>
    ))}
  </ul>
);

export const CarrerOpportunityList: FunctionComponent<CarrerOpportunityListProps> = ({
  trainingProgramId,
}) => {
  const { error, data, isLoading } = useGetCarrerOpportunityList(trainingProgramId);

  return (
    <div className="rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-base font-semibold flex items-center gap-2">
          <BriefcaseIcon size={18} className="text-primary" />
          Débouchés / Opportunités de carrière
          {!isLoading && data && (
            <span className="badge badge-soft badge-primary badge-sm">
              {data.length}
            </span>
          )}
        </h3>

        <ButtonOpenModal
          modal="formCarrerOpportunity"
          modalProps={{
            type: "add",
            trainingProgramId,
          }}
          className="btn btn-soft btn-primary btn-sm"
        >
          <PlusIcon className="size-4" />
          Ajouter
        </ButtonOpenModal>
      </div>

      {error ? (
        <EmptyState
          icon={<Bug size={22} className="text-error/40" />}
          title="Aucune opportunité"
          description={error.message}
        />
      ) : isLoading ? (
        <CarrerOpportunityListSkeleton />
      ) : data && data.length === 0 ? (
        <EmptyState
          icon={
            <BriefcaseIcon size={22} className="text-base-content/40" />
          }
          title="Aucune opportunité"
          description="Ce programme de formation n'a pas encore de débouchés enregistrés."
        />
      ) : (
        <ul className="space-y-3">
          {data?.map((opportunity) => (
            <CarrerOpportunityItem key={opportunity.id} carrerOpportunity={opportunity} />
          ))}
        </ul>
      )}
    </div>
  );
};
