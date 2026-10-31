import type { CSSProperties, ReactNode } from "react";

const positionsTooltip = {
  bottom: "tooltip-bottom",
  right: "tooltip-right",
  left: "tooltip-left",
  top: "tooltip-top",
};

interface ButtonLoadingProps extends React.ComponentProps<"button"> {
  loadingComponent?: ReactNode;
}

export interface ButtonProps extends React.ComponentProps<"button"> {
  dataTip?: string;
  positionTooltip?: keyof typeof positionsTooltip;
}

export function ButtonLoading({
  disabled,
  loadingComponent,
  children,
  ...rest
}: ButtonLoadingProps) {
  return (
    <button {...rest} disabled={disabled}>
      {loadingComponent && disabled === true && (
        <span className="loading"></span>
      )}
      {children}
    </button>
  );
}

export function Button({
  children,
  dataTip,
  positionTooltip = "bottom",
  ...rest
}: ButtonProps) {
  return (
    <div
      className={`tooltip ${positionsTooltip[positionTooltip]}`}
      data-tip={dataTip}
    >
      <button {...rest}>{children}</button>
    </div>
  );
}
