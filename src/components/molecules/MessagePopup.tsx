"use client";

import { type FunctionComponent, useEffect, useRef, useCallback } from "react";
import { TriangleAlert, AlertCircle, CheckCircle, Info } from "lucide-react";
import { useModalStore, type MessagePopupData } from "@/store/useModalStore";

const iconMap = {
  info: <Info className="size-12 text-blue-500" />,
  danger: <TriangleAlert className="size-12 text-red-600" />,
  success: <CheckCircle className="size-12 text-green-600" />,
  warning: <AlertCircle className="size-12 text-yellow-600" />,
};

const bgColorMap = {
  info: "bg-blue-50 border-blue-200",
  danger: "bg-red-50 border-red-200",
  success: "bg-green-50 border-green-200",
  warning: "bg-yellow-50 border-yellow-200",
};

type MessagePopupComponentProps = MessagePopupData;

export const MessagePopupComponent: FunctionComponent<
  MessagePopupComponentProps
> = ({
  type = "danger",
  title = "Confirmation",
  message = "Êtes-vous sûr de vouloir continuer ?",
  showBtnCancel = false,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  onConfirm,
  onCancel,
}) => {
  const { closeModal, setLoading, isLoading } = useModalStore();
  const focusTrapRef = useRef<HTMLDivElement>(null);

  // manage keyboard events for accessibility (Escape to cancel, Enter to confirm)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCancel();
      }
      if (e.key === "Enter" && !showBtnCancel) {
        handleConfirm();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showBtnCancel]);

  // Focus trap
  useEffect(() => {
    const previousActiveElement = document.activeElement as HTMLElement;

    if (focusTrapRef.current) {
      const buttons = focusTrapRef.current.querySelectorAll("button");
      buttons[0]?.focus();
    }

    return () => {
      previousActiveElement?.focus();
    };
  }, []);

  const handleConfirm = useCallback(async () => {
    try {
      setLoading(true);
      await onConfirm?.();
    } catch (error) {
      console.error("Erreur lors de la confirmation:", error);
    } finally {
      setLoading(false);
      closeModal();
    }
  }, [onConfirm, closeModal, setLoading]);

  const handleCancel = useCallback(() => {
    onCancel?.();
    closeModal();
  }, [onCancel, closeModal]);

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40 animate-in fade-in"
        onClick={handleCancel}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="popup-title"
        aria-describedby="popup-message"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in zoom-in-95 duration-200"
      >
        <div
          ref={focusTrapRef}
          className={`w-full max-w-sm bg-white rounded-lg shadow-2xl border ${bgColorMap[type]} p-6 space-y-4 animate-in slide-in-from-bottom-4`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with icon*/}
          <div className="flex flex-col items-center text-center gap-4">
            <div className="shrink-0">{iconMap[type]}</div>
            <div className="space-y-2">
              <h2
                id="popup-title"
                className="text-lg font-semibold text-gray-900"
              >
                {title}
              </h2>
              <p
                id="popup-message"
                className="text-sm text-gray-600 leading-relaxed"
              >
                {message}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-center pt-4">
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium transition-colors duration-200 disabled:cursor-not-allowed"
              aria-busy={isLoading}
            >
              {isLoading ? "Chargement..." : confirmText}
            </button>
            {showBtnCancel && (
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-900 font-medium transition-colors duration-200 disabled:cursor-not-allowed"
              >
                {cancelText}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MessagePopupComponent;
