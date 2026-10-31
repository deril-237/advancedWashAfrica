import { useId } from "react";

export type TypeInputProps = React.ComponentProps<"textarea"> & {
  label?: string;
  error?: string;
};

export default function TextArea({
  label,
  error,
  readOnly,
  ref,
  className,
  required,
  ...props
}: TypeInputProps) {
  const inputId = useId();

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

      <textarea
        id={inputId}
        ref={ref}
        readOnly={readOnly}
        required={required}
        {...props}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`
          textarea w-full rounded-lg border bg-base-100 text-base-content shadow-none
          border-primary/40 transition-all duration-200 ease-out
          placeholder:text-base-content/40
          focus:border-primary focus:outline-none focus:ring focus:ring-primary/60
          disabled:cursor-not-allowed disabled:bg-base-200 disabled:opacity-60
          ${error ? "border-error focus:border-error focus:ring-error/20" : ""}
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
