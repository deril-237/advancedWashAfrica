import { Section, Text } from "react-email";

type AlertProps = {
  variant?: "success" | "warning" | "error";
  children: React.ReactNode;
};

const variants = {
  success: {
    bg: "bg-success/10",
    text: "text-success",
    border: "border-success",
  },
  warning: {
    bg: "bg-warning/10",
    text: "text-warning",
    border: "border-warning",
  },
  error: { bg: "bg-error/10", text: "text-error", border: "border-error" },
};

export function Alert({ variant = "warning", children }: AlertProps) {
  const style = variants[variant];

  return (
    <Section
      className={`rounded-lg border-l-4 ${style.border} ${style.bg} px-4 py-3`}
    >
      <Text className={`m-0 text-sm ${style.text}`}>{children}</Text>
    </Section>
  );
}
