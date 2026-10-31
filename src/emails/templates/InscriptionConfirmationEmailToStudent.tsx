import { Heading, Hr, Row, Column, Section, Text } from "react-email";

import { EmailLayout } from "../layout";
import { Alert } from "../components/Alert";

type InscriptionConfirmationEmailToStudentProps = {
  studentName: string;
  trainingName: string;
  submittedAt: string;
};

export function InscriptionConfirmationEmailToStudent({
  studentName,
  trainingName,
  submittedAt,
}: InscriptionConfirmationEmailToStudentProps) {
  return (
    <EmailLayout
      preview={`Votre inscription à ${trainingName} a bien été reçue`}
    >
      <Section>
        {/* Icône check */}
        <Section className="mb-6 text-center">
          <Section className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
            <Text className="m-0 font-heading text-2xl text-success">✓</Text>
          </Section>
        </Section>

        <Heading className="m-0 mb-3 text-center font-heading text-2xl font-bold text-primary">
          Inscription bien reçue
        </Heading>

        <Text className="mb-6 text-center font-sans text-sm text-muted">
          Merci pour votre confiance, votre demande est en cours de traitement.
        </Text>

        <Hr className="my-6 border-border" />

        <Text className="mb-1 font-sans text-base leading-relaxed text-foreground">
          Bonjour {studentName},
        </Text>

        <Text className="mb-6 font-sans text-base leading-relaxed text-foreground">
          Nous vous confirmons la bonne réception de votre demande d'inscription
          à la formation <strong>{trainingName}</strong>. Notre équipe va
          l'examiner et reviendra vers vous très prochainement.
        </Text>

        {/* Fiche récap */}
        <Section className="mb-6 rounded-lg bg-background px-5 py-5">
          <Row className="mb-3">
            <Column>
              <Text className="m-0 font-sans text-xs uppercase tracking-wide text-muted">
                Formation
              </Text>
              <Text className="m-0 font-sans text-base font-bold text-foreground">
                {trainingName}
              </Text>
            </Column>
          </Row>

          <Row>
            <Column>
              <Text className="m-0 font-sans text-xs uppercase tracking-wide text-muted">
                Soumis le
              </Text>
              <Text className="m-0 font-sans text-sm text-foreground">
                {submittedAt}
              </Text>
            </Column>
          </Row>
        </Section>

        {/* Prochaines étapes */}
        <Text className="mb-3 font-sans text-sm font-bold text-foreground">
          Et maintenant ?
        </Text>

        <Section className="mb-6">
          <Row className="mb-2">
            <Column className="w-6 align-top">
              <Text className="m-0 font-sans text-sm text-secondary">1.</Text>
            </Column>
            <Column>
              <Text className="m-0 font-sans text-sm text-foreground">
                Notre équipe examine votre dossier
              </Text>
            </Column>
          </Row>
          <Row className="mb-2">
            <Column className="w-6 align-top">
              <Text className="m-0 font-sans text-sm text-secondary">2.</Text>
            </Column>
            <Column>
              <Text className="m-0 font-sans text-sm text-foreground">
                Vous recevez un email de confirmation ou de refus
              </Text>
            </Column>
          </Row>
          <Row>
            <Column className="w-6 align-top">
              <Text className="m-0 font-sans text-sm text-secondary">3.</Text>
            </Column>
            <Column>
              <Text className="m-0 font-sans text-sm text-foreground">
                En cas d'acceptation, les détails d'accès vous sont transmis
              </Text>
            </Column>
          </Row>
        </Section>

        <Alert variant="success">
          Aucune action n'est requise de votre part pour le moment. Nous
          reviendrons vers vous rapidement.
        </Alert>

        <Text className="mt-6 font-sans text-sm text-muted">
          Une question ? Contactez-nous à{" "}
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

export default InscriptionConfirmationEmailToStudent;
