"use client";

import { useId, useRef, useState } from "react";
import { Upload, FileText } from "lucide-react";

export type TypeInputFileProps = Omit<
  React.ComponentProps<"input">,
  "type" | "onChange" | "value"
> & {
  label?: string;
  error?: string;
  showPreview?: boolean;
  onChange?: (files: FileList | null) => void;
};

export function InputFile({
  label,
  error,
  readOnly,
  ref,
  className,
  multiple,
  accept,
  showPreview = true,
  onChange,
  ...props
}: TypeInputFileProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFiles = (files: FileList | null) => {
    if (showPreview) {
      const names = files ? Array.from(files).map((f) => f.name) : [];
      setFileNames(names);

      if (files && files.length === 1 && files[0].type.startsWith("image/")) {
        const url = URL.createObjectURL(files[0]);
        setPreviewUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
      } else {
        setPreviewUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return null;
        });
      }
    }

    onChange?.(files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (readOnly) return;

    const files = e.dataTransfer.files;
    if (inputRef.current) {
      inputRef.current.files = files;
    }
    processFiles(files);
  };

  return (
    <div>
      <input
        id={inputId}
        type="file"
        ref={(node) => {
          inputRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref)
            (ref as React.RefObject<HTMLInputElement | null>).current = node;
        }}
        readOnly={readOnly}
        disabled={readOnly}
        multiple={multiple}
        accept={accept}
        onChange={handleChange}
        {...props}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
      />
    </div>
    // <div className="form-control w-full flex flex-col gap-1.5">
    //   {label && (
    //     <label
    //       htmlFor={inputId}
    //       className="label-text font-sans font-semibold text-base-content/80 first-letter:capitalize ml-1"
    //     >
    //       {label}
    //     </label>
    //   )}

    //   <div
    //     onDragOver={(e) => {
    //       e.preventDefault();
    //       if (!readOnly) setIsDragging(true);
    //     }}
    //     onDragLeave={() => setIsDragging(false)}
    //     onDrop={handleDrop}
    //     className={`
    //       relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed
    //       px-4 py-8 text-center transition-all duration-200
    //       ${isDragging ? "border-primary bg-primary/5" : "border-base-300 bg-base-100"}
    //       ${error ? "border-error/60" : ""}
    //       ${
    //         readOnly
    //           ? "cursor-not-allowed bg-base-200 opacity-70"
    //           : "hover:border-primary/50 hover:bg-base-200/50"
    //       }
    //     `}
    //   >

    //     <Upload className="h-6 w-6 text-primary/70" />
    //     <p className="text-sm font-medium text-base-content">
    //       Glissez votre fichier ici
    //     </p>
    //     <p className="text-xs text-base-content/50">
    //       ou cliquez pour sélectionner
    //       {accept ? ` — formats acceptés : ${accept}` : ""}
    //     </p>
    //   </div>

    //   {showPreview && fileNames.length > 0 && (
    //     <div className="mt-1 flex flex-col gap-2 ml-1">
    //       {previewUrl && (
    //         <img
    //           src={previewUrl}
    //           alt="Aperçu du fichier"
    //           className="h-24 w-24 rounded-lg border border-base-300 object-cover"
    //         />
    //       )}
    //       <ul className="flex flex-col gap-1">
    //         {fileNames.map((name) => (
    //           <li
    //             key={name}
    //             className="flex items-center gap-2 truncate text-sm text-base-content/70"
    //           >
    //             <FileText className="h-4 w-4 shrink-0 text-primary/70" />
    //             {name}
    //           </li>
    //         ))}
    //       </ul>
    //     </div>
    //   )}

    //   {error && (
    //     <p
    //       id={`${inputId}-error`}
    //       className="text-error text-sm font-medium mt-1 ml-1 animate-in fade-in slide-in-from-top-1 duration-200"
    //     >
    //       {error}
    //     </p>
    //   )}
    // </div>
  );
}
