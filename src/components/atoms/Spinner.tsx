type Size = "sm" | "md" | "lg" | "xl";
type Variant = "dark" | "light" | "secondary" | "primary" | "success";

export function Spinner({
  size = "md",
  variant = "primary",
  text = "",
}: {
  size: Size;
  variant: Variant;
  text?: string;
}) {
  const sizeClasses: Record<Size, string> = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-16 h-16 border-4",
    xl: "w-24 h-24 border-[5px]",
  };

  const variantClasses: Record<Variant, string> = {
    primary: "border-primary border-t-transparent",
    secondary: "border-secondary border-t-transparent",
    success: "border-success border-t-transparent",
    dark: "border-dark border-t-transparent",
    light: "border-light border-t-primary",
  };

  const textSizeClasses: Record<Size, string> = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`
          ${sizeClasses[size]} 
          ${variantClasses[variant]}
          border-s-transparent
          rounded-full 
          animate-spin
        `}
        role="status"
        aria-label="Chargement"
      />
      {text && (
        <p className={`${textSizeClasses[size]} text-gray-dark font-medium`}>
          {text}
        </p>
      )}
    </div>
  );
}

export function SpinnerOverlay({
  text = "loading...",
  variant = "primary",
}: {
  variant?: Variant;
  text?: string;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-2xl">
        <Spinner size="lg" variant={variant} text={text} />
      </div>
    </div>
  );
}

export function DotsSpinner({ variant = "primary" }: { variant: Variant }) {
  const dotColors: Record<Variant, string> = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    success: "bg-success",
    dark: "bg-gray-dark",
    light: "bg-gray-ligth",
  };

  return (
    <div className="flex gap-2" role="status" aria-label="Chargement">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={`
            w-3 h-3 rounded-full ${dotColors[variant]}
            animate-bounce
          `}
          style={{
            animationDelay: `${index * 0.15}s`,
            animationDuration: "0.6s",
          }}
        />
      ))}
    </div>
  );
}

export function PulseSpinner({ variant = "primary" }: { variant: Variant }) {
  const pulseColors: Record<Variant, string> = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    success: "bg-success",
    dark: "bg-gray-dark",
    light: "bg-gray-ligth",
  };

  return (
    <div className="relative w-16 h-16" role="status" aria-label="Chargement">
      <div
        className={`
          absolute inset-0 ${pulseColors[variant]} 
          rounded-full opacity-75 animate-ping
        `}
      />
      <div
        className={`
          absolute inset-0 ${pulseColors[variant]} 
          rounded-full
        `}
      />
    </div>
  );
}
