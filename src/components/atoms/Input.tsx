import { useId } from "react";

export type TypeInputProps = React.ComponentProps<"input"> & {
  label?: string;
  error?: string;
};

export function Input({
  label,
  error,
  readOnly,
  ref,
  className,
  required,
  ...props
}: TypeInputProps) {
  const inputId = useId();

  const borderColor = error
    ? "border-error focus:border-error focus:ring-error/20"
    : readOnly
      ? "border-base-300"
      : "border-primary/30 hover:border-primary/50 focus:border-primary focus:ring-primary/30";

  return (
    <div className="form-control w-full flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="label-text font-sans font-semibold text-base-content/80 first-letter:capitalize ml-1"
        >
          {label}
          {required && <span className="text-error ml-0.5">*</span>}
        </label>
      )}

      <input
        id={inputId}
        ref={ref}
        readOnly={readOnly}
        required={required}
        {...props}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`
          input w-full rounded-lg border bg-base-100 text-base-content shadow-xs
          transition-all duration-200 ease-out
          placeholder:text-base-content/40
          focus:outline-none focus:ring
          disabled:cursor-not-allowed disabled:bg-base-200 disabled:opacity-60
          ${borderColor}
          ${readOnly ? "cursor-not-allowed bg-base-200 text-base-content/60" : ""}
          ${className ?? ""}
        `}
      />

      {error && (
        <p
          id={`${inputId}-error`}
          className="text-error text-sm font-medium mt-1 ml-1 animate-in fade-in slide-in-from-top-1 duration-200"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;
