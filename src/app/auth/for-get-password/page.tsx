import { AuthLayout, VerifyEmailForm } from "@/features/auth";

export default async function ForgetPasswordPage({
  params,
  searchParams,
}: PageProps<"/auth/for-get-password">) {
  const { email } = await searchParams;

  return (
    <AuthLayout
      title="Mot de passe oublié"
      description="Entrez votre adresse e-mail pour recevoir un lien de réinitialisation de mot de passe."
    >
      <VerifyEmailForm email={email as string} />
    </AuthLayout>
  );
}
