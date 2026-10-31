import { Hr, Section, Text } from "react-email";
import { INSTITUTE_NAME } from "@/constants";

export function EmailFooter() {
  return (
    <Section className="mt-6 px-4 text-center">
      <Text className="m-0 font-sans text-sm font-bold text-primary">
        {INSTITUTE_NAME}
      </Text>
      <Text className="m-1 text-xs text-muted">
        Cet email a été envoyé automatiquement, merci de ne pas y répondre.
      </Text>
      <Text className="m-0 text-xs text-muted">
        © 2026 {INSTITUTE_NAME} — Tous droits réservés.
      </Text>
    </Section>
  );
}
