import { AuthLayout, ResetPasswordForm } from "@/features/auth";

export default async function ResetPasswordPage({
  searchParams,
}: PageProps<"/auth/reset-password">) {
  const { token } = await searchParams;

  return (
    <AuthLayout
      title="Réinitialiser le mot de passe"
      description="Entrez votre nouveau mot de passe pour réinitialiser votre compte."
    >
      <ResetPasswordForm token={token as string} />
    </AuthLayout>
  );
}
