import { Button, Heading, Hr, Row, Column, Section, Text } from "react-email";

import { EmailLayout } from "../layout";

type InscriptionConfirmationEmailToAdminProps = {
  link: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  trainingName: string;
  submittedAt: string;
};

export function InscriptionConfirmationEmailToAdmin({
  link,
  studentName,
  studentEmail,
  studentPhone,
  trainingName,
  submittedAt,
}: InscriptionConfirmationEmailToAdminProps) {
  return (
    <EmailLayout
      preview={`Nouvelle inscription : ${studentName} — ${trainingName}`}
    >
      <Section>
        {/* Badge statut */}
        <Section className="mb-6 text-center">
          <Section className="mx-auto inline-block rounded-full bg-secondary/20 px-4 py-1">
            <Text className="m-0 font-sans text-xs font-bold uppercase tracking-wide text-primary">
              Nouvelle inscription
            </Text>
          </Section>
        </Section>

        <Heading className="m-0 mb-3 text-center font-heading text-2xl font-bold text-primary">
          Une inscription en attente
        </Heading>

        <Text className="mb-6 text-center font-sans text-sm text-muted">
          Un(e) candidat(e) vient de s'inscrire à une formation. Une action de
          votre part est requise.
        </Text>

        <Hr className="my-6 border-border" />

        {/* Fiche récap candidat */}
        <Section className="mb-6 rounded-lg bg-background px-5 py-5">
          <Row className="mb-3">
            <Column>
              <Text className="m-0 font-sans text-xs uppercase tracking-wide text-muted">
                Candidat
              </Text>
              <Text className="m-0 font-sans text-base font-bold text-foreground">
                {studentName}
              </Text>
            </Column>
          </Row>

          <Row className="mb-3">
            <Column>
              <Text className="m-0 font-sans text-xs uppercase tracking-wide text-muted">
                Formation demandée
              </Text>
              <Text className="m-0 font-sans text-base font-bold text-foreground">
                {trainingName}
              </Text>
            </Column>
          </Row>

          <Row className="mb-3">
            <Column>
              <Text className="m-0 font-sans text-xs uppercase tracking-wide text-muted">
                Contact
              </Text>
              <Text className="m-0 font-sans text-sm text-foreground">
                {studentEmail}
                {studentPhone ? ` · ${studentPhone}` : ""}
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

        <Section className="mb-2 text-center">
          <Button
            href={link}
            className="box-border rounded-lg bg-primary px-8 py-3 text-center font-sans text-sm font-bold text-white"
          >
            Examiner l'inscription
          </Button>
        </Section>

        <Text className="text-center font-sans text-xs text-muted">
          Acceptez ou rejetez cette demande depuis le tableau de bord
          KesTraining.
        </Text>
      </Section>
    </EmailLayout>
  );
}

export default InscriptionConfirmationEmailToAdmin;
