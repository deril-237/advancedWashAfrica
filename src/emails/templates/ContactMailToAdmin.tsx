import { Heading, Hr, Row, Column, Section, Text } from "react-email";

import { EmailLayout } from "../layout";

export type TrainingProgramContactMailToAdminProps = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export function ContactMailToAdmin({
  name,
  email,
  subject,
  message,
}: TrainingProgramContactMailToAdminProps) {
  return (
    <EmailLayout preview={`Nouveau message de ${name} : ${subject}`}>
      <Section>
        <Section className="mb-6 text-center">
          <Section className="mx-auto inline-block rounded-full bg-secondary/20 px-4 py-1">
            <Text className="m-0 font-sans text-xs font-bold uppercase tracking-wide text-primary">
              Nouveau message de contact
            </Text>
          </Section>
        </Section>

        <Heading className="m-0 mb-3 text-center font-heading text-2xl font-bold text-primary">
          {subject}
        </Heading>

        <Text className="mb-6 text-center font-sans text-sm text-muted">
          Un visiteur a soumis le formulaire de contact.
        </Text>

        <Hr className="my-6 border-border" />

        {/* Fiche expéditeur */}
        <Section className="mb-6 rounded-lg bg-background px-5 py-5">
          <Row className="mb-3">
            <Column>
              <Text className="m-0 font-sans text-xs uppercase tracking-wide text-muted">
                De
              </Text>
              <Text className="m-0 font-sans text-base font-bold text-foreground">
                {name}
              </Text>
            </Column>
          </Row>

          <Row>
            <Column>
              <Text className="m-0 font-sans text-xs uppercase tracking-wide text-muted">
                Email
              </Text>
              <Text className="m-0 font-sans text-sm text-foreground">
                <a href={`mailto:${email}`} className="text-primary underline">
                  {email}
                </a>
              </Text>
            </Column>
          </Row>
        </Section>

        {/* Message */}
        <Text className="m-0 mb-2 font-sans text-xs uppercase tracking-wide text-muted">
          Message
        </Text>
        <Section className="mb-2 rounded-lg border border-border bg-surface px-5 py-4">
          <Text className="m-0 whitespace-pre-line font-sans text-base leading-relaxed text-foreground">
            {message}
          </Text>
        </Section>

        <Text className="mt-6 text-center font-sans text-xs text-muted">
          Répondez directement à cet email pour contacter {name}.
        </Text>
      </Section>
    </EmailLayout>
  );
}

export default ContactMailToAdmin;
