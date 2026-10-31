import {
  Select,
  TypeSelectProps,
  SelectValue,
  SelectOption,
} from "@/components/atoms/Select";
import { useGetWaveList } from "../hooks";
import { Identifier } from "@/interfaces/entities";
import { FunctionComponent, useMemo } from "react";
import { Wave } from "../types";

export type SelectWaveProps = Omit<
  TypeSelectProps,
  "onChange" | "onChangeValue" | "options" | "isMulti" | "onInputChange"
> & {
  trainingProgramId: Identifier;
  onChangeValue?: (value: string | null) => void;
  onChange: (value: SelectOption | null) => void;
};

export const SelectWave: FunctionComponent<SelectWaveProps> = ({
  trainingProgramId,
  onChangeValue,
  onChange,
  placeholder = "Selectionner d'abord un parcours",
  label = "Vagues",
  ...props
}) => {
  const { data, error, isFetching } = useGetWaveList({ trainingProgramId });

  const options: SelectOption[] = useMemo(
    () =>
      data?.map((wave) => ({
        value: wave.id,
        label: `vague du ${wave.startDate.toDateString()}`,
      })) ?? [],
    [data],
  );

  const handleChangeValue = (nextValue: SelectValue | SelectValue[] | null) => {
    const singleValue = Array.isArray(nextValue)
      ? (nextValue[0] ?? null)
      : nextValue;

    onChangeValue?.(singleValue != null ? String(singleValue) : null);
  };

  const handleChange = (nextValue: SelectOption | SelectOption[] | null) => {
    const singleValue = Array.isArray(nextValue)
      ? (nextValue[0] ?? null)
      : nextValue;

    onChange?.(singleValue != null ? singleValue : null);
  };

  return (
    <Select
      disabled={trainingProgramId ? false : true}
      {...props}
      placeholder={placeholder}
      label={label}
      options={options}
      error={error ? "Erreur lors du chargment des vagues" : undefined}
      onChange={handleChange}
      onChangeValue={handleChangeValue}
      isLoading={isFetching}
      noOptionsMessage={() => "Aucune vague disponible"}
    />
  );
};
