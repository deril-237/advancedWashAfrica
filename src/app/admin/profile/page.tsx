"use server";

import { User, User2, Mail, Lock, Shield, Pencil } from "lucide-react";

import { TitlePage } from "@/components/atoms/TitlePage";
import { getAuthenticatedSessionAndRedirect } from "@/lib/betterAuth/auth-server";
import { ReactNode } from "react";
import { ButtonOpenModal } from "@/components/molecules";

function InfoCard({
  icon,
  label,
  value,
  action,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-base-300 bg-base-200/40 p-4">
      <div className="flex items-start gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-wide text-base-content/50">
            {label}
          </p>

          <p className="mt-1 break-all font-medium text-base-content">
            {value}
          </p>
        </div>

        <div>{action}</div>
      </div>
    </div>
  );
}

export default async function ProfilePage() {
  const { user } = await getAuthenticatedSessionAndRedirect();

  return (
    <div className="space-y-6">
      <TitlePage
        icon={<User />}
        title="Mon profil"
        description="Consultez vos informations personnelles et gérez les paramètres de votre compte."
      />

      <div className="mx-auto max-w-3xl">
        <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
          {/* Header */}
          <div className="relative bg-primary px-8 pb-16 pt-10">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-secondary" />

            <div className="flex flex-col items-center text-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-primary-content/10 ring-4 ring-secondary/70">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name ?? "Utilisateur"}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <User2 size={42} className="text-primary-content/70" />
                )}
              </div>

              <h2 className="mt-5 font-heading text-3xl font-semibold text-primary-content">
                {user.name ?? "Utilisateur"}
              </h2>

              <div className="mt-3">
                <span className="badge badge-secondary badge-soft font-sans">
                  Compte utilisateur
                </span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="space-y-6 p-8">
            <div>
              <h3 className="font-heading text-lg text-primary">
                Informations du compte
              </h3>

              <p className="mt-1 text-sm text-base-content/60">
                Ces informations sont utilisées pour votre authentification et
                votre identification sur la plateforme.
              </p>
            </div>

            <div className="grid gap-4">
              <InfoCard
                icon={<Mail size={18} />}
                label="Adresse email"
                value={user.email}
              />

              <InfoCard
                icon={<Lock size={18} />}
                label="Mot de passe"
                value="••••••••••••••••"
                action={
                  <ButtonOpenModal
                    className="btn btn-soft btn-square btn-secondary"
                    modal="changePassword"
                    modalProps={undefined}
                  >
                    <Pencil size={10} />
                  </ButtonOpenModal>
                }
              />

              <InfoCard
                icon={<Shield size={18} />}
                label="Méthode de connexion"
                value="Email et mot de passe"
              />
            </div>

            <div className="divider my-0" />

            {/* <div className="flex justify-end">
              <button className="btn btn-primary">
                <Pencil size={18} />
                Modifier le profil
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
