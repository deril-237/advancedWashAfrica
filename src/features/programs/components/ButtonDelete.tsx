import { FunctionComponent } from "react";
import { useDeleteProgram } from "../hooks";
import { TrashIcon } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { toast } from "react-toastify";
import { SpinnerOverlay } from "@/components/atoms/Spinner";
import { useMessagePopup } from "@/store/useModalStore";

export const ButtonDelete: FunctionComponent<{ programId: string }> = ({
  programId,
}) => {
  const { isPending, mutateAsync } = useDeleteProgram();
  const { openConfirm } = useMessagePopup();

  const deleteProgram = async () => {
    const result = await mutateAsync(programId);

    if (result.serverError) {
      toast.error(
        result.serverError.global ??
          "Une erreur est survenue lors de la suppression du programme.",
      );

      return;
    }
    toast.success("Programme supprimé avec succès !");
  };

  const handleDelete = async () => {
    openConfirm({
      type: "danger",
      title: "Supprimer ?",
      message:
        "Cette action est irréversible. Êtes-vous sûr de vouloir supprimer ce parcours ?",
      onConfirm: deleteProgram,
      showBtnCancel: true,
    });
  };

  return (
    <>
      {isPending ? <SpinnerOverlay /> : null}
      <Button className="bg-error btn btn-error p-2" onClick={handleDelete}>
        <TrashIcon className="size-6 text-base-100" />
      </Button>
    </>
  );
};
