import { SelectTraining, SelectTrainingProgram } from "@/features/trainings";
import { RadioModalityOptionGroup } from "../RadioModalityOptionGroup";
import { RadioMotivationOptionGroup } from "@/features/studentMotivations/components/RadioMotivationOptions";
import { useFormContext, Controller } from "react-hook-form";
import TextArea from "@/components/atoms/TextArea";
import { StudentFirstInscriptionInput } from "../../types";

export const Step2ChooseTraining = () => {
  const { control, watch } = useFormContext<StudentFirstInscriptionInput>();

  const trainingId = watch("trainingId");
  return (
    <div>
      <fieldset className="w-full  fieldset bg-base-100 md:border-base-300 md:rounded-box md:border p-4">
        <legend className="label text-sm font-sans font-semibold text-base-content/80 first-letter:capitalize ml-1">
          Quel formation souhaites suivre ?{" "}
          <span className="text-error ml-0.5">*</span>
        </legend>
        <div className="flex flex-col gap-6 md:flex-row">
          <Controller
            control={control}
            name="trainingId"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <SelectTraining
                label="Formation"
                placeholder="Choisissez une formation"
                value={value}
                onChangeValue={onChange}
                error={error?.message}
                required={true}
              />
            )}
          />
          <Controller
            control={control}
            name="trainingProgramId"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <SelectTrainingProgram
                trainingId={trainingId}
                disabled={!trainingId}
                label="Parcours"
                placeholder="Choisissez un parcours"
                value={value}
                onChangeValue={onChange}
                error={error?.message}
                required={true}
              />
            )}
          />
        </div>
      </fieldset>

      <fieldset className="w-full fieldset bg-base-100 md:border-base-300 md:rounded-box md:border p-4">
        <legend className="label text-wrap text-sm font-sans font-semibold text-base-content/80 first-letter:capitalize ml-1">
          Comment souhaitez-vous suivre la formation ?{" "}
          <span className="text-error ml-0.5">*</span>
        </legend>

        <Controller
          control={control}
          name="modality"
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <RadioModalityOptionGroup
              value={value}
              onChange={onChange}
              error={error?.message}
            />
          )}
        />
      </fieldset>

      <fieldset className="fieldset bg-base-100 md:border-base-300 md:rounded-box md:border p-4">
        <legend className="label  text-wrap text-sm font-sans font-semibold text-base-content/80 first-letter:capitalize ml-1">
          Qu'est-ce qui vous amène à vous former dans l'action humanitaire ?
        </legend>
        <div className="space-y-4">
          <Controller
            control={control}
            name="motivations"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <RadioMotivationOptionGroup
                value={value}
                onChange={onChange}
                error={error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="otherMotivation"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <TextArea
                label="Autres"
                rows={4}
                value={value}
                onChange={onChange}
              />
            )}
          />
        </div>
      </fieldset>
    </div>
  );
};
