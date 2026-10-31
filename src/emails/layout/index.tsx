import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
} from "react-email";

import { theme } from "../theme";
import { EmailHeader } from "./EmailHeader";
import { EmailFooter } from "./EmailFooter";

type EmailLayoutProps = {
  children: React.ReactNode;
  preview?: string;
  logoUrl?: string;
};

export function EmailLayout({ children, preview, logoUrl }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      {preview && <Preview>{preview}</Preview>}
      <Tailwind config={theme}>
        <Body className="m-0 bg-white font-sans py-10">
          <Container className="mx-auto max-w-[600px]">
            {/* Barre d'accent gold en haut de carte */}
            <Section className="h-[6px] rounded-t-card bg-primary" />

            <Container className="rounded-b-card bg-surface px-8 py-10 shadow-sm">
              <EmailHeader logoUrl={logoUrl} />
              {children}
            </Container>

            <EmailFooter />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
