import { AuthLayout, VerifyEmailResponse } from "@/features/auth";

export default async function VerifyEmailPage({
  params,
  searchParams,
}: PageProps<"/auth/verify-email">) {
  const { email } = await searchParams;
  return (
    <AuthLayout
      title="Vérification de l'email"
      description="Vérifiez votre boîte de réception pour confirmer votre adresse e-mail."
    >
      <VerifyEmailResponse email={email as string} />
    </AuthLayout>
  );
}
