"use client";

import { useMemo } from "react";
import Select, {
  type SelectOption,
  type SelectValue,
} from "@/components/atoms/Select";
import { useGetProgramList } from "../hooks";

type SelectTrainingProgramProps = {
  label?: string;
  placeholder?: string;
  name?: string;
  className?: string;
  disabled?: boolean;
  inputId?: string;
  value?: string | null;
  error?: string;
  isClearable?: boolean;
  isSearchable?: boolean;
  onChangeValue?: (value: string | null) => void;
  onChange?: (value: SelectOption | null) => void;
  required?: boolean;
};

export function SelectProgram({
  label = "Parcours",
  placeholder = "Sélectionner un parcours",
  name,
  className,
  disabled = false,
  inputId,
  value,
  error,
  isClearable = true,
  isSearchable = true,
  onChangeValue,
  onChange,
  required,
}: SelectTrainingProgramProps) {
  const { data = [], isLoading, isError } = useGetProgramList();

  const options = useMemo(
    () =>
      data.map((program) => ({
        value: program.id,
        label: `Parcours de ${program.duration} mois`,
      })),
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
      label={label}
      placeholder={placeholder}
      name={name}
      className={className}
      inputId={inputId}
      options={options}
      value={value ?? null}
      onChange={handleChange}
      onChangeValue={handleChangeValue}
      isLoading={isLoading}
      disabled={disabled}
      isClearable={isClearable}
      isSearchable={isSearchable}
      required={required}
      error={isError ? "Impossible de charger les parcours" : error}
      noOptionsMessage={() => "Aucun parcours disponible"}
    />
  );
}

export default SelectProgram;
