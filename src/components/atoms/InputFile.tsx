"use client";

import { useId, useRef, useState, useCallback, useEffect } from "react";
import { Upload, FileText, X } from "lucide-react";
import Image from "next/image";

export type TypeInputFileProps = Omit<
  React.ComponentProps<"input">,
  "type" | "onChange" | "value"
> & {
  label?: string;
  error?: string;
  showPreview?: boolean;
  onChange?: (files: FileList | null) => void;
  defaultPreview?: Preview | null;
};

type Preview = {
  kind: "image" | "icon";
  src: string;
};

const mimeTypePreview: Record<string, string> = {
  "application/pdf": "/images/file-types/pdf.png",
  "application/vnd.ms-excel": "/images/file-types/xls.svg",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    "/images/file-types/xlsx.svg",
  "application/msword": "/images/file-types/doc.svg",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "/images/file-types/docx.svg",
  "application/vnd.ms-powerpoint": "/images/file-types/ppt.svg",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    "/images/file-types/pptx.svg",
  "text/plain": "/images/file-types/txt.svg",
  "text/csv": "/images/file-types/csv.svg",
  "application/zip": "/images/file-types/zip.svg",
  "application/x-zip-compressed": "/images/file-types/zip.svg",
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
  defaultPreview = null,
  onChange,
  ...props
}: TypeInputFileProps) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dragCounter = useRef(0);

  const [fileNames, setFileNames] = useState<string[]>([]);
  const [preview, setPreview] = useState<Preview | null>(defaultPreview);
  const [isDragging, setIsDragging] = useState(false);

  const clearPreview = useCallback(() => {
    setPreview((prev) => {
      if (prev?.kind === "image" && prev.src.startsWith("blob:")) {
        URL.revokeObjectURL(prev.src);
      }
      return null;
    });
  }, []);

  const processFiles = useCallback(
    (files: FileList | null) => {
      setFileNames(files ? Array.from(files).map((f) => f.name) : []);

      if (showPreview) {
        clearPreview();

        if (files && files.length === 1) {
          const file = files[0];
          if (file.type.startsWith("image/")) {
            setPreview({ kind: "image", src: URL.createObjectURL(file) });
          } else {
            setPreview({
              kind: "icon",
              src: mimeTypePreview[file.type] ?? "/images/file-types/file.svg",
            });
          }
        }
      }

      onChange?.(files);
    },
    [showPreview, clearPreview, onChange],
  );

  const handleClear = useCallback(() => {
    if (inputRef.current) inputRef.current.value = "";
    clearPreview();
    setFileNames([]);
    onChange?.(null);
  }, [clearPreview, onChange]);

  useEffect(() => {
    return () => {
      if (preview?.kind === "image" && preview.src.startsWith("blob:")) {
        URL.revokeObjectURL(preview.src);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);
    if (readOnly) return;

    const files = e.dataTransfer.files;
    if (inputRef.current) inputRef.current.files = files;
    processFiles(files);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (readOnly) return;
    dragCounter.current += 1;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragging(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_8rem] gap-4 items-start">
      <div>
        <label
          htmlFor={inputId}
          className="label-text font-sans font-semibold text-base-content/80 first-letter:capitalize ml-1 mb-1 block"
        >
          {label}
        </label>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative rounded-xl border-2 border-dashed transition-all duration-200
            px-4 py-4
            ${isDragging ? "border-primary bg-primary/5" : "border-primary/30 hover:border-primary/50"}
            ${error ? "border-error/60" : ""}
            ${readOnly ? "cursor-not-allowed bg-base-200 opacity-70" : "hover:border-primary/50 hover:bg-base-200/40"}
          `}
        >
          <input
            id={inputId}
            type="file"
            ref={(node) => {
              inputRef.current = node;
              if (typeof ref === "function") ref(node);
              else if (ref)
                (ref as React.RefObject<HTMLInputElement | null>).current =
                  node;
            }}
            readOnly={readOnly}
            disabled={readOnly}
            multiple={multiple}
            accept={accept}
            onChange={handleChange}
            {...props}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          />

          <div className="flex items-start gap-3 pointer-events-none">
            <div className="mt-0.5 rounded-lg bg-primary/10 p-2 text-primary">
              <Upload size={18} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm">
                Cliquez ou déposez un fichier
              </p>
              <p className="text-xs text-base-content/60 mt-1">
                {accept
                  ? `Formats : ${accept}`
                  : "Tous les formats sont acceptés"}
              </p>

              {showPreview && fileNames.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {fileNames.map((name, i) => (
                    <li
                      key={`${name}-${i}`}
                      className="flex items-center gap-2 text-sm truncate"
                    >
                      <FileText size={15} className="text-primary shrink-0" />
                      <span className="truncate">{name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {!readOnly && fileNames.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="pointer-events-auto rounded-full p-1 hover:bg-base-300/60"
                aria-label="Retirer le fichier"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {error && (
          <p
            id={errorId}
            className="mt-1 ml-1 text-sm font-medium text-error animate-in fade-in slide-in-from-top-1 duration-200"
          >
            {error}
          </p>
        )}
      </div>

      {preview ? (
        <Image
          src={preview.src}
          width={112}
          height={112}
          alt="Aperçu"
          className={`h-28 w-28 rounded-xl border border-base-300 bg-base-100 ${
            preview.kind === "image" ? "object-cover" : "object-contain p-4"
          }`}
        />
      ) : (
        <div className="h-28 w-28 rounded-xl border border-dashed border-base-300 bg-base-100 flex items-center justify-center">
          <FileText size={32} className="text-base-content/30" />
        </div>
      )}
    </div>
  );
}
