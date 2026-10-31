import AuthLayout from "@/features/auth/components/AuthLayout";
import { SigninForm } from "@/features/auth/components/SigninForm";

export default function Login() {
  return (
    <AuthLayout title="Connexion" description="Connectez-vous à votre compte">
      <SigninForm />
    </AuthLayout>
  );
}
