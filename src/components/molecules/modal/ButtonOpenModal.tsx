"use client";

import { useModalStore } from "@/store/useModalStore";
import { FunctionComponent } from "react";
import { Button, ButtonProps } from "@/components/atoms/Button";
import { ModalRegistry } from "@/store/useModalStore";

interface ButtonOpenModalProps<
  K extends keyof ModalRegistry = keyof ModalRegistry,
> extends Omit<ButtonProps, "onClick"> {
  modal: K;
  modalProps: ModalRegistry[K];
  onClick?: (data: ModalRegistry[K]) => void;
}

export const ButtonOpenModal: FunctionComponent<ButtonOpenModalProps> = ({
  modal,
  modalProps,
  onClick,
  children,
  ...rest
}) => {
  const { openModal } = useModalStore();

  const handleClick = () => {
    openModal(modal, modalProps);
    onClick?.(modalProps);
  };
  return (
    <Button onClick={handleClick} {...rest}>
      {children}
    </Button>
  );
};
