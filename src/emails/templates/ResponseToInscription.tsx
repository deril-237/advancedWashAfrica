import { Heading, Hr, Row, Column, Section, Text, Button } from "react-email";

import { EmailLayout } from "../layout";
import { Alert } from "../components/Alert";

export type ResponseToInscriptionProps = {
  studentName: string;
  trainingName: string;
  accepted: boolean;
  reasonRejected?: string;
};

export function ResponseToInscription({
  studentName,
  trainingName,
  accepted,
  reasonRejected,
}: ResponseToInscriptionProps) {
  return (
    <EmailLayout
      preview={
        accepted
          ? `Votre inscription à ${trainingName} est acceptée`
          : `Mise à jour concernant votre inscription à ${trainingName}`
      }
    >
      <Section>
        {/* Icône statut */}
        <Section className="mb-6 text-center">
          <Section
            className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
              accepted ? "bg-success/10" : "bg-error/10"
            }`}
          >
            <Text
              className={`m-0 font-heading text-2xl ${
                accepted ? "text-success" : "text-error"
              }`}
            >
              {accepted ? "✓" : "✕"}
            </Text>
          </Section>
        </Section>

        <Heading className="m-0 mb-3 text-center font-heading text-2xl font-bold text-primary">
          {accepted ? "Inscription acceptée" : "Inscription non retenue"}
        </Heading>

        <Text className="mb-6 text-center font-sans text-sm text-muted">
          {accepted
            ? "Félicitations, votre place est confirmée."
            : "Nous vous remercions pour votre candidature."}
        </Text>

        <Hr className="my-6 border-border" />

        <Text className="mb-1 font-sans text-base leading-relaxed text-foreground">
          Bonjour {studentName},
        </Text>

        {accepted ? (
          <>
            <Text className="mb-6 font-sans text-base leading-relaxed text-foreground">
              Nous avons le plaisir de vous informer que votre inscription à la
              formation <strong>{trainingName}</strong> a été acceptée.
              Bienvenue chez KesTraining !
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
              Vous recevrez prochainement les informations pratiques
              (calendrier, accès aux ressources) pour démarrer la formation.
            </Alert>
          </>
        ) : (
          <>
            <Text className="mb-6 font-sans text-base leading-relaxed text-foreground">
              Après examen de votre dossier, nous ne sommes malheureusement pas
              en mesure de retenir votre inscription à la formation{" "}
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
          </>
        )}

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

export default ResponseToInscription;
