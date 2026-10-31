import { Section, Text } from "react-email";

import { EmailLayout } from "../layout";
import { Alert } from "../components/Alert";

type OtpVerificationEmailProps = {
  firstName: string;
  otpCode: string;
  expiresInMinutes?: number;
  logoUrl?: string;
};

export default function OtpVerificationEmail({
  firstName = "Étudiant",
  otpCode = "482913",
  expiresInMinutes = 10,
  logoUrl,
}: OtpVerificationEmailProps) {
  return (
    <EmailLayout
      preview={`Votre code de vérification KesTraining : ${otpCode}`}
      logoUrl={logoUrl}
    >
      <Text className="m-0 mb-1 font-sans text-base text-foreground">
        Bonjour {firstName},
      </Text>

      <Text className="mb-6 font-sans text-base leading-relaxed text-foreground">
        Voici votre code de vérification pour finaliser votre inscription sur{" "}
        <strong>KesTraining</strong>. Saisissez-le dans le formulaire pour
        continuer.
      </Text>

      {/* Bloc code OTP — élément visuel central */}
      <Section className="mb-6 rounded-lg bg-primary px-6 py-8 text-center">
        <Text className="m-0 mb-2 font-sans text-xs uppercase tracking-widest text-secondary">
          Code de vérification
        </Text>
        <Text className="m-0 font-heading text-4xl font-bold tracking-[0.3em] text-white">
          {otpCode}
        </Text>
      </Section>

      <Text className="mb-6 text-center font-sans text-sm text-muted">
        Ce code expire dans{" "}
        <strong className="text-foreground">{expiresInMinutes} minutes</strong>.
      </Text>

      <Alert variant="warning">
        Si vous n'êtes pas à l'origine de cette demande, ignorez cet email. Ne
        partagez jamais ce code, même avec le support KesTraining.
      </Alert>

      {/* <Text className="mt-8 font-sans text-sm text-muted">
        Besoin d'aide ? Contactez-nous à{" "}
        <a
          href="mailto:support@kestraining.cm"
          className="text-primary underline"
        >
          support@kestraining.cm
        </a>
      </Text> */}
    </EmailLayout>
  );
}
