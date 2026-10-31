import { Heading, Hr, Section, Text } from "react-email";

import { EmailLayout } from "../layout";
import { Alert } from "../components/Alert";

export type RejectedInscriptionEmailProps = {
  studentName: string;
  trainingName: string;
  reasonRejected?: string;
};

export function RejectedInscriptionEmail({
  studentName,
  trainingName,
  reasonRejected,
}: RejectedInscriptionEmailProps) {
  return (
    <EmailLayout
      preview={`Mise à jour concernant votre inscription à ${trainingName}`}
    >
      <Section>
        <Section className="mb-6 text-center">
          <Section className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-error/10">
            <Text className="m-0 font-heading text-2xl text-center text-error">
              ✕
            </Text>
          </Section>
        </Section>

        <Heading className="m-0 mb-3 text-center font-heading text-2xl font-bold text-primary">
          Inscription non retenue
        </Heading>

        <Text className="mb-6 text-center font-sans text-sm text-muted">
          Nous vous remercions pour votre candidature.
        </Text>

        <Hr className="my-6 border-border" />

        <Text className="mb-1 font-sans text-base leading-relaxed text-foreground">
          Bonjour {studentName},
        </Text>

        <Text className="mb-6 font-sans text-base leading-relaxed text-foreground">
          Après examen de votre dossier, nous ne sommes malheureusement pas en
          mesure de retenir votre inscription à la formation{" "}
          <strong>{trainingName}</strong> pour cette session.
        </Text>

        {reasonRejected ? (
          <Section className="mb-6 rounded-lg bg-background px-5 py-5">
            <Text className="m-0 mb-1 font-sans text-xs uppercase tracking-wide text-muted">
              Motif
            </Text>
            <Text className="m-0 font-sans text-sm text-foreground">
              {reasonRejected}
            </Text>
          </Section>
        ) : null}

        <Text className="mb-6 font-sans text-sm leading-relaxed text-foreground">
          N'hésitez pas à vous inscrire lors d'une prochaine session ou à
          consulter nos autres formations disponibles.
        </Text>

        <Alert variant="warning">
          Pour toute question sur cette décision, notre équipe reste à votre
          disposition.
        </Alert>

        <Text className="mt-6 font-sans text-sm text-muted">
          Une question ?{" "}
          <a
            href="mailto:support@kestraining.cm"
            className="text-primary underline"
          >
            support@kestraining.cm
          </a>
        </Text>
      </Section>
    </EmailLayout>
  );
}

export default RejectedInscriptionEmail;
