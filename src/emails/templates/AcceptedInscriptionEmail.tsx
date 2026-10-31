import { Heading, Hr, Row, Column, Section, Text, Button } from "react-email";

import { EmailLayout } from "../layout";
import { Alert } from "../components/Alert";

export type AcceptedInscriptionEmailProps = {
  // logoUrl: string;
  studentName: string;
  trainingName: string;
  // loginLink?: string;
};

export function AcceptedInscriptionEmail({
  studentName,
  trainingName,
  // loginLink,
}: AcceptedInscriptionEmailProps) {
  return (
    <EmailLayout preview={`Votre inscription à ${trainingName} est acceptée`}>
      <Section>
        <Section className="mb-6 text-center">
          <Section className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
            <Text className="m-0 font-heading text-2xl text-center text-success">
              ✓
            </Text>
          </Section>
        </Section>

        <Heading className="m-0 mb-3 text-center font-heading text-2xl font-bold text-primary">
          Inscription acceptée
        </Heading>

        <Text className="mb-6 text-center font-sans text-sm text-muted">
          Félicitations, votre place est confirmée.
        </Text>

        <Hr className="my-6 border-border" />

        <Text className="mb-1 font-sans text-base leading-relaxed text-foreground">
          Bonjour {studentName},
        </Text>

        <Text className="mb-6 font-sans text-base leading-relaxed text-foreground">
          Nous avons le plaisir de vous informer que votre inscription à la
          formation <strong>{trainingName}</strong> a été acceptée. Bienvenue à
          KESMONDS INTERNATIONAL UNIVERSITY !
        </Text>

        <Section className="mb-6 rounded-lg bg-background px-5 py-5">
          <Row>
            <Column>
              <Text className="m-0 font-sans text-xs uppercase tracking-wide text-muted">
                Formation
              </Text>
              <Text className="m-0 font-sans text-base font-bold text-foreground">
                {trainingName}
              </Text>
            </Column>
          </Row>
        </Section>

        {/* {loginLink ? (
          <Section className="mb-6 text-center">
            <Button
              href={loginLink}
              className="box-border rounded-lg bg-primary px-8 py-3 text-center font-sans text-sm font-bold text-white"
            >
              Accéder à mon espace
            </Button>
          </Section>
        ) : null} */}

        <Alert variant="success">
          Vous recevrez prochainement les informations pratiques (calendrier,
          accès aux ressources) pour démarrer la formation.
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

export default AcceptedInscriptionEmail;
