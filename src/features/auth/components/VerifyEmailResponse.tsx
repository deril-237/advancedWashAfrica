export function VerifyEmailResponse({ email }: { email: string }) {
  return (
    <div className="card bg-base-300 shadow-xl p-1 w-full">
      <p>
        Un email de vérification a été envoyé à <strong>{email}</strong>.
        Veuillez vérifier votre boîte de réception et cliquer sur le lien de
        vérification.
      </p>
    </div>
  );
}
