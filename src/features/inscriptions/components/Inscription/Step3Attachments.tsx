import { InputFile } from "@/components/atoms/InputFile";
import { useFormContext, Controller } from "react-hook-form";
import { StudentFirstInscriptionInput } from "../../types";

export const Step3Attachments = () => {
  const { control } = useFormContext<StudentFirstInscriptionInput>();

  return (
    <div className="flex flex-col gap-6">
      {/* Photo */}
      <Controller
        control={control}
        name="photo"
        render={({ field: { onChange, name, ref }, fieldState: { error } }) => (
          <InputFile
            ref={ref}
            name={name}
            label="Photo"
            accept="image/jpeg,image/png"
            showPreview={true}
            multiple={false}
            onChange={(files) => onChange(files?.[0] ?? null)}
            error={error?.message}
          />
        )}
      />

      {/* Diplôme */}
      <Controller
        control={control}
        name="diploma"
        render={({ field: { onChange, name, ref }, fieldState: { error } }) => (
          <InputFile
            ref={ref}
            name={name}
            label="Diplôme"
            accept=".pdf"
            showPreview={true}
            multiple={false}
            onChange={(files) => onChange(files?.[0] ?? null)}
            error={error?.message}
          />
        )}
      />

      {/* CNI / Passeport */}
      <Controller
        control={control}
        name="cniPassport"
        render={({ field: { onChange, name, ref }, fieldState: { error } }) => (
          <InputFile
            ref={ref}
            name={name}
            label="CNI/Passeport"
            accept=".pdf"
            showPreview={true}
            multiple={false}
            onChange={(files) => onChange(files?.[0] ?? null)}
            error={error?.message}
          />
        )}
      />
    </div>
  );
};
