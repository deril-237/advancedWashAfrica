import { Button, Heading, Hr, Section, Text, Link } from "react-email";

import { EmailLayout } from "../layout";
import { Alert } from "../components/Alert";

type VerificationEmailProps = {
  // logoUrl: string;
  link: string;
  name: string;
  expiresInMinutes?: number;
};

export function ResetPasswordEmail({
  link,
  name,
  expiresInMinutes = 30,
}: VerificationEmailProps) {
  return (
    <EmailLayout preview="Réinitialisez votre mot de passe KesTraining">
      <Section>
        <Section className="mb-6 text-center">
          <Section className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Text className="m-0 font-heading text-2xl text-primary">🔒</Text>
          </Section>
        </Section>

        <Heading className="m-0 mb-3 text-center font-heading text-2xl font-bold text-primary">
          Réinitialisation du mot de passe
        </Heading>

        <Text className="mb-6 text-center font-sans text-sm text-muted">
          Une demande de réinitialisation a été faite pour votre compte.
        </Text>

        <Hr className="my-6 border-border" />

        <Text className="mb-1 font-sans text-base leading-relaxed text-foreground">
          Bonjour {name},
        </Text>

        <Text className="mb-6 font-sans text-base leading-relaxed text-foreground">
          Vous avez demandé la réinitialisation de votre mot de passe sur{" "}
          <strong>KesTraining</strong>. Cliquez sur le bouton ci-dessous pour en
          choisir un nouveau.
        </Text>

        <Section className="mb-6 text-center">
          <Link
            href={link}
            className="box-border rounded-lg bg-primary px-8 py-3 text-center font-sans text-sm font-bold text-white"
          >
            Réinitialiser mon mot de passe
          </Link>
        </Section>

        <Text className="mb-6 text-center font-sans text-xs text-muted">
          Ce lien expire dans{" "}
          <strong className="text-foreground">
            {expiresInMinutes} minutes
          </strong>
          .
        </Text>

        <Alert variant="warning">
          Si vous n'êtes pas à l'origine de cette demande, ignorez cet email —
          votre mot de passe restera inchangé. Ne partagez jamais ce lien.
        </Alert>

        <Hr className="my-6 border-border" />

        <Text className="m-0 mb-1 font-sans text-xs text-muted">
          Le bouton ne fonctionne pas ? Copiez ce lien dans votre navigateur :
        </Text>
        <Link className="m-0 break-all font-sans text-xs text-primary underline">
          {link}
        </Link>
      </Section>
    </EmailLayout>
  );
}

export default ResetPasswordEmail;
