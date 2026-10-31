"use client";

import { useId } from "react";

export type RadioValue = string | number;

export type RadioOption<T extends RadioValue = RadioValue> = {
  label: string;
  value: T;
};

export type RadioGroupProps = Omit<
  React.ComponentProps<"input">,
  "value" | "checked" | "onChange" | "type"
> & {
  label?: string;
  error?: string;
  options: RadioOption[];
  value?: RadioValue;
  defaultValue?: string;
  onChange?: (value: string) => void;
  isLoading?: boolean;
};

export default function RadioGroup({
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
}: RadioGroupProps) {
  const groupId = useId();
  const currentValue = value ?? "";

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <p className="label-text font-sans font-semibold text-base-content/80 first-letter:capitalize ml-1">
          {label}
          {required && <span className="text-error ml-0.5">*</span>}
        </p>
      )}

      <div
        role="group"
        aria-label={label}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3"
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
                  flex cursor-pointer items-center justify-center rounded-xl border
                  border-base-300 bg-base-100 px-4 py-3 text-center text-sm font-medium
                  text-base-content transition-all duration-200 hover:border-primary/40
                  has-checked:border-primary has-checked:bg-primary/5 has-checked:shadow-sm
                  has-focus-visible:ring-2 has-focus-visible]:ring-primary/30
                  ${error ? "border-error/50" : ""}
                `}
              >
                <input
                  type="radio"
                  id={optionId}
                  name={name}
                  value={option.value}
                  // ref={ref}
                  onBlur={onBlur}
                  onChange={(e) => onChange?.(e.target.value)}
                  checked={currentValue === option.value}
                  aria-invalid={!!error}
                  className="sr-only"
                  required={required}
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
