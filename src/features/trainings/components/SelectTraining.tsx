"use client";

import { useMemo } from "react";
import Select, {
  type SelectOption,
  type SelectValue,
} from "@/components/atoms/Select";
import { useInfiniteGetTrainingList } from "@/features/trainings/hooks";
import type { Training, TrainingListItem } from "@/features/trainings/types";

type SelectTrainingProps = {
  label?: string;
  placeholder?: string;
  name?: string;
  className?: string;
  disabled?: boolean;
  inputId?: string;
  value?: string | null;
  error?: string;
  isClearable?: boolean;
  onChange?: (value: SelectOption | null) => void;
  onChangeValue?: (value: string | null) => void;
  required?: boolean;
};

function toTrainingOption(training: TrainingListItem): SelectOption {
  return {
    label: training.name,
    value: training.id,
  };
}

export function SelectTraining({
  label = "Formations",
  placeholder = "Sélectionner une formation",
  name,
  className,
  disabled = false,
  inputId,
  value,
  error,
  isClearable = true,
  onChangeValue: onChangeValue,
  onChange,
  required,
}: SelectTrainingProps) {
  const { data, isLoading, isError, fetchNextPage } =
    useInfiniteGetTrainingList();

  const options = useMemo(
    () =>
      (data?.pages.flatMap((page) => page.rows) ?? []).map(toTrainingOption),
    [data?.pages],
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
      error={
        error ?? (isError ? "Impossible de charger les formations" : undefined)
      }
      required={required}
      noOptionsMessage={() => "Aucune formation disponible"}
      onMenuScrollToBottom={fetchNextPage}
    />
  );
}

export default SelectTraining;
