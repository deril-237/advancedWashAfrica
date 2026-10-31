"use client";

import MessagePopupComponent from "@/components/molecules/MessagePopup";
import type { MessagePopupData } from "@/store/useModalStore";

interface MessagePopupModalProps {
  data: MessagePopupData | undefined;
}

/**
 * Wrapper pour intégrer MessagePopup au système de modales
 * Adapte le type de données au composant MessagePopup
 */
export function MessagePopupModal({ data }: MessagePopupModalProps) {
  if (!data) return null;

  return (
    <MessagePopupComponent
      type={data.type}
      title={data.title}
      message={data.message}
      showBtnCancel={data.showBtnCancel}
      confirmText={data.confirmText}
      cancelText={data.cancelText}
      onConfirm={data.onConfirm}
      onCancel={data.onCancel}
    />
  );
}
