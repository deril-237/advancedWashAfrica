import { FunctionComponent } from "react";
import { ArchiveIcon, CirclePlay } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { toast } from "react-toastify";
import { SpinnerOverlay } from "@/components/atoms/Spinner";
import { useLockWaveCourse, useUnlockWaveCourse } from "../hooks";

export const ButtonLockCourseWave: FunctionComponent<{ waveId: string }> = ({
  waveId: programId,
}) => {
  const { isPending, mutateAsync } = useLockWaveCourse();
  const lockWaveCourse = async () => {
    const result = await mutateAsync(programId);

    if (result.serverError) {
      toast.error(
        "Une erreur est survenue lors de le traitement. S'il vous réssayer",
      );

      return;
    }
    toast.success("La vague a été bloqué avec success");
  };

  return (
    <>
      {isPending ? <SpinnerOverlay /> : null}
      <Button
        dataTip="terminer la vague"
        className=" btn-error btn-sm text-white btn p-2"
        onClick={lockWaveCourse}
      >
        <ArchiveIcon className="size-6 text-base-100" />
        <span>Terminé</span>
      </Button>
    </>
  );
};

export const ButtonUnlockCourseWave: FunctionComponent<{
  waveId: string;
}> = ({ waveId: programId }) => {
  const { isPending, mutateAsync } = useUnlockWaveCourse();
  const lockWaveCourse = async () => {
    const result = await mutateAsync(programId);

    if (result.serverError) {
      toast.error(
        "Une erreur est survenue lors de le traitement. S'il vous réssayer",
      );

      return;
    }
    toast.success("Les cours de la vague ont été debloqué  avec success");
  };

  return (
    <>
      {isPending ? <SpinnerOverlay /> : null}
      <Button
        dataTip="debloquer la vague"
        className="btn btn-neutral btn-sm p-2"
        onClick={lockWaveCourse}
      >
        <CirclePlay className="size-6 text-base-100" />
        <span className="text-white">Relancer</span>
      </Button>
    </>
  );
};
