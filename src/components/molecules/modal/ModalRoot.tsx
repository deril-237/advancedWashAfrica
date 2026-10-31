"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  ModalRegistry,
  useModalStore,
  type ModalType,
} from "@/store/useModalStore";
import { XIcon } from "lucide-react";

export type ModalContentType = {
  [K in ModalType]: React.ComponentType<{ data: ModalRegistry[K] }>;
};

// Types of modals that use a custom structure (no standard dialog)
const CUSTOM_MODAL_TYPES = new Set<string>(["messagePopup"]);

function renderModalContent<K extends ModalType>(
  modalContentMap: ModalContentType,
  modalType: K,
  data: ModalRegistry[K] | undefined,
) {
  const Component = modalContentMap[modalType] as React.ComponentType<{
    data: ModalRegistry[K] | undefined;
  }>;

  return <Component data={data} />;
}

export function ModalRoot({
  modalContentMap,
}: {
  modalContentMap: ModalContentType;
}) {
  const isOpen = useModalStore((s) => s.isOpen);
  const modalType = useModalStore((s) => s.modalType);
  const data = useModalStore((s) => s.data);
  const closeModal = useModalStore((s) => s.closeModal);

  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const target = typeof document !== "undefined" ? document.body : null;
  if (!target || !modalType) return null;

  const ContentComponent = modalContentMap[modalType];
  if (!ContentComponent) return null;

  // For custom modals (messagePopup), display without the dialog wrapper.
  if (CUSTOM_MODAL_TYPES.has(modalType)) {
    if (!isOpen) return null;
    return createPortal(
      renderModalContent(modalContentMap, modalType, data),
      target,
    );
  }

  //For standard modals, use the dialog structure.
  return createPortal(
    <dialog
      ref={dialogRef}
      className="modal px-4"
      onClose={closeModal}
      onCancel={closeModal}
    >
      <div className="modal-box sticky max-h-10/12 w-full bg-white md:max-w-2xl">
        <button
          type="button"
          className="absolute btn btn-circle bg-white hover:bg-zinc-100 border-none top-2 right-2"
          onClick={closeModal}
        >
          <XIcon className="size-5 text-black" />
        </button>

        {renderModalContent(modalContentMap, modalType, data)}
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={closeModal}>close</button>
      </form>
    </dialog>,
    target,
  );
}
