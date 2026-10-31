import RadioGroup, {
  RadioGroupProps,
  RadioOption,
} from "@/components/atoms/RadioGroup";
import { ModalityOption } from "../types";

export type ModalityOptionProps = Omit<RadioGroupProps, "options">;

export function RadioModalityOptionGroup(props: ModalityOptionProps) {
  const radioOptions: RadioOption<ModalityOption>[] = [
    { label: "En ligne", value: "ON_LINE" },
    { label: "En présentiel", value: "OFF_LINE" },
  ];

  return (
    <RadioGroup
      options={radioOptions}
      // label="Comment vous souhaitez suivre la formation ? "
      {...props}
    />
  );
}
