import { INSTITUTE_NAME } from "@/constants";
import { Img, Section, Text } from "react-email";

type EmailHeaderProps = {
  logoUrl?: string;
};

export function EmailHeader({ logoUrl }: EmailHeaderProps) {
  return (
    <Section className="mb-8 text-center">
      {logoUrl ? (
        <Img
          src={logoUrl}
          alt={INSTITUTE_NAME}
          width="56"
          height="56"
          className="mx-auto mb-3 rounded-lg"
        />
      ) : null}

      <Text className="m-0 font-heading text-2xl font-bold text-primary">
        {INSTITUTE_NAME}
      </Text>
    </Section>
  );
}
