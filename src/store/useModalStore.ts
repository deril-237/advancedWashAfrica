import { create } from "zustand";

export interface MessagePopupData {
  type: "info" | "danger" | "success" | "warning";
  title: string;
  message: string;
  showBtnCancel?: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

export interface ModalRegistry {
  messagePopup?: MessagePopupData;
}

export type ModalType = keyof ModalRegistry;

interface ModalState {
  modalType: ModalType | undefined;
  isOpen: boolean;
  isLoading: boolean;
  openModal: <K extends ModalType>(
    modalType: K,
    data: ModalRegistry[K],
  ) => void;
  closeModal: () => void;
  setLoading: (loading: boolean) => void;
  data: ModalRegistry[ModalType] | undefined;
}

export const useModalStore = create<ModalState>((set) => ({
  modalType: undefined,
  isOpen: false,
  isLoading: false,
  openModal: <K extends ModalType>(modalType: K, data: ModalRegistry[K]) =>
    set({ isOpen: true, data, modalType }),
  closeModal: () =>
    set({ isOpen: false, data: undefined, modalType: undefined }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  data: undefined,
}));

/**
 * Hook to display a confirmation popup
 * @example
 * const { openConfirm } = useMessagePopup();
 * await openConfirm({
 *   type: "danger",
 *   title: "Delete ?",
 *   message: "This action is irreversible. Are you sure you want to delete this item ?",
 * });
 */
export function useMessagePopup() {
  const { openModal, closeModal } = useModalStore();

  return {
    openConfirm: (data: MessagePopupData) => {
      openModal("messagePopup", data);
    },
    closeConfirm: closeModal,
  };
}
