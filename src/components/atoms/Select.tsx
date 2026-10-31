"use client";

import { useId, type FunctionComponent, type ReactNode, useMemo } from "react";
import ReactSelect, {
  type MultiValue,
  type SingleValue,
  type SingleValueProps,
} from "react-select";

export type SelectValue = string;

export type SelectOption = {
  label: string;
  value: SelectValue;
};

export type TypeSelectProps = {
  label?: string;
  placeholder?: string;
  error?: string;
  options?: SelectOption[];
  value?: SelectValue | SelectValue[] | null;
  defaultValue?: SelectOption | SelectOption[] | null;
  onChange?: (value: SelectOption | SelectOption[] | null) => void;
  onChangeValue: (value: SelectValue | SelectValue[] | null) => void;
  isMulti?: boolean;
  isLoading?: boolean;
  onMenuScrollToBottom?: () => void;
  isClearable?: boolean;
  isSearchable?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  name?: string;
  className?: string;
  inputId?: string;
  noOptionsMessage?: (obj: { inputValue: string }) => string;
  loadingMessage?: (obj: { inputValue: string }) => string;
  menuPlacement?: "auto" | "bottom" | "top";
  onInputChange?: (value: string) => void;
  onRenderOption?: (
    option: SelectOption,
    meta: { context: "menu" | "value" },
  ) => ReactNode;
  required?: boolean;
};

export const Select: FunctionComponent<TypeSelectProps> = ({
  label,
  placeholder,
  error,
  options = [],
  value,
  defaultValue,
  onChange,
  onChangeValue,

  isMulti = false,
  isLoading = false,
  onMenuScrollToBottom,
  isClearable = false,
  isSearchable = true,
  disabled = false,
  readOnly = false,
  name,
  className,
  inputId,
  noOptionsMessage,
  loadingMessage,
  menuPlacement = "bottom",
  onInputChange,
  onRenderOption,
  required,
}: TypeSelectProps) => {
  const idSelect = useId();
  const resolvedInputId = inputId ?? idSelect;

  const handleChange = (
    newValue: SingleValue<SelectOption> | MultiValue<SelectOption>,
  ) => {
    onChange?.(newValue as SelectOption | SelectOption[]);

    if (isMulti) {
      onChangeValue(
        (newValue as MultiValue<SelectOption>).map((item) => item.value),
      );
    } else {
      onChangeValue((newValue as SingleValue<SelectOption>)?.value ?? null);
    }
  };

  const selectedValue = useMemo(() => {
    if (isMulti) {
      return options.filter((option) =>
        (value as SelectValue[] | undefined)?.some(
          (v) => String(v) === String(option.value),
        ),
      );
    }

    return (
      options.find((option) => String(option.value) === String(value)) ?? null
    );
  }, [options, value, isMulti]);

  return (
    <div className="form-control w-full flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={resolvedInputId}
          className="label-text font-sans font-semibold text-base-content/80 first-letter:capitalize ml-1"
        >
          {label}
          {required && <span className="text-error ml-0.5">*</span>}
        </label>
      )}

      <ReactSelect
        unstyled
        instanceId={resolvedInputId}
        inputId={resolvedInputId}
        name={name}
        options={options}
        value={selectedValue}
        defaultValue={
          defaultValue as
            | SingleValue<SelectOption>
            | MultiValue<SelectOption>
            | undefined
        }
        onChange={handleChange}
        placeholder={placeholder}
        isMulti={isMulti}
        isLoading={isLoading}
        isClearable={isClearable}
        isSearchable={isSearchable}
        isDisabled={disabled || readOnly}
        onMenuScrollToBottom={onMenuScrollToBottom}
        onInputChange={onInputChange}
        noOptionsMessage={noOptionsMessage}
        loadingMessage={loadingMessage}
        menuPlacement={menuPlacement}
        aria-invalid={!!error}
        formatOptionLabel={
          onRenderOption
            ? (option, { context }) => onRenderOption(option, { context })
            : undefined
        }
        className={className}
        classNames={{
          control: (state) =>
            [
              `select select-primary/50 w-full rounded-lg border bg-base-100 text-base-content shadow-none
          border-zinc-500 transition-all duration-200 ease-out
          placeholder:text-base-content/40
          focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20
          disabled:cursor-not-allowed disabled:bg-base-200 disabled:opacity-60`,
              "px-2",
              error
                ? "border-error focus:border-error focus:ring-error/20"
                : "",
              readOnly || disabled
                ? "cursor-not-allowed bg-base-200 text-base-content/60"
                : "",
              state.isFocused && !error
                ? "outline outline-2 outline-primary outline-offset-0 border-primary"
                : "",
              state.isFocused && error
                ? "outline outline-2 outline-error outline-offset-0"
                : "",
            ]
              .filter(Boolean)
              .join(" "),

          placeholder: () => "text-base-content",

          input: () => "text-base-content font-sans",

          singleValue: () => "text-base-content font-sans",

          valueContainer: () => "gap-1 py-0.5",

          multiValue: () =>
            "bg-primary/10 rounded-md items-center pl-2 pr-1 gap-1",
          multiValueLabel: () => "text-primary text-sm font-medium",
          multiValueRemove: () =>
            "rounded-sm hover:bg-primary/20 hover:text-primary px-0.5 cursor-pointer",

          indicatorsContainer: () => "gap-0.5",
          dropdownIndicator: () =>
            "text-base-content/50 hover:text-base-content px-1.5 cursor-pointer",
          clearIndicator: () =>
            "text-base-content/50 hover:text-error px-1.5 cursor-pointer",
          indicatorSeparator: () => "bg-base-content/15",

          menu: () =>
            "bg-base-100 border border-base-content/10 rounded-lg mt-1 shadow-lg overflow-hidden z-50",
          menuList: () => "py-1",

          option: (state) =>
            [
              "px-3 py-2 text-base-content font-sans cursor-pointer",
              state.isSelected
                ? "bg-primary text-primary-content"
                : state.isFocused
                  ? "bg-base-200"
                  : "bg-transparent",
            ].join(" "),

          noOptionsMessage: () => "text-base-content/50 py-2 px-3 text-sm",
          loadingMessage: () => "text-base-content/50 py-2 px-3 text-sm",
        }}
      />

      {error && (
        <p className="text-error text-sm font-medium mt-1 ml-1 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;
