"use client";

import { useId } from "react";

export type CheckboxValue = string | number;

export type CheckboxOption<T extends CheckboxValue = CheckboxValue> = {
  label: string;
  value: T;
  checked?: boolean;
};

export type CheckboxGroupProps = Omit<
  React.ComponentProps<"input">,
  "value" | "checked" | "onChange" | "defaultValue" | "type"
> & {
  label?: string;
  error?: string;
  options: CheckboxOption[];
  value?: CheckboxValue[];
  defaultValue?: CheckboxValue[];
  onChange?: (values: CheckboxValue[]) => void;
  isLoading?: boolean;
};

export function CheckboxGroup({
  label,
  error,
  options,
  name,
  value,
  defaultValue,
  ref,
  className,
  onChange,
  onBlur,
  isLoading = false,
  required,
  ...props
}: CheckboxGroupProps) {
  const groupId = useId();

  const handleChange = (optionValue: CheckboxValue, checked: boolean) => {
    const current = value ?? [];
    const next = checked
      ? [...current, optionValue]
      : current.filter((v) => v !== optionValue);
    onChange?.(next);
  };

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <p className="label text-primary font-sans font-semibold first-letter:capitalize ml-1">
          {label}
          {required && <span className="text-error ml-0.5">*</span>}
        </p>
      )}

      <div
        role="group"
        aria-label={label}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2"
      >
        {isLoading ? (
          <span className="loading loading-spinner text-primary"></span>
        ) : (
          options.map((option) => {
            const optionId = `${groupId}-${option.value}`;
            return (
              <label
                key={option.value}
                htmlFor={optionId}
                className={`
                  label text-zinc-950 text-wrap
                  ${error ? "border-error/50" : ""}
                `}
              >
                <input
                  type="checkbox"
                  id={optionId}
                  name={name}
                  value={option.value}
                  // ref={ref}
                  onBlur={onBlur}
                  checked={value?.includes(option.value) ? true : false}
                  onChange={(e) => handleChange(option.value, e.target.checked)}
                  aria-invalid={!!error}
                  className="checkbox checkbox-primary"
                  // required={required}
                  {...props}
                />
                {option.label}
              </label>
            );
          })
        )}
      </div>

      {error && (
        <p className="text-error text-sm font-medium mt-1 ml-1 animate-in fade-in slide-in-from-top-1 duration-200">
          {error}
        </p>
      )}
    </div>
  );
}
