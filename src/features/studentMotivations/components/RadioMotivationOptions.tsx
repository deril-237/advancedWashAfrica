"use client";

import {
  CheckboxGroupProps,
  CheckboxOption,
  CheckboxGroup,
} from "@/components/atoms/CheckboxGroup";
import { useGetMotivationOptionsList } from "../hooks";

export type ModalityOptionProps = Omit<CheckboxGroupProps, "options">;

export function RadioMotivationOptionGroup(props: ModalityOptionProps) {
  const { data, error, isFetching } = useGetMotivationOptionsList();
  const radioOptions: CheckboxOption[] =
    data?.map((option) => ({ label: option.label, value: option.id })) ?? [];

  return (
    <CheckboxGroup
      options={radioOptions}
      // label="Comment vous souhaitez suivre la formation ? "
      isLoading={isFetching}
      error={error?.message}
      {...props}
    />
  );
}
