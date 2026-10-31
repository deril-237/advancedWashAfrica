import Link from "next/link";
import { GraduationCap, Sparkles } from "lucide-react";
import { ReactNode } from "react";
import Image from "next/image";

type AuthLayoutProps = {
  children: ReactNode;
  title: string;
  description: string;
};

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-base-white flex">
      {/* LEFT BRAND PANEL */}
      <section className="relative hidden lg:flex lg:w-3/5 overflow-hidden">
        <Image
          src="/images/auth-bg.jpeg"
          alt="Campus universitaire"
          fill
          className="object-cover"
          priority
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/90 via-primary/70 to-primary/40" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-primary-content">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary-content/20 backdrop-blur">
                <GraduationCap size={28} />
              </div>

              <span className="font-heading text-3xl">KesTraining</span>
            </div>
          </div>

          {/* Hero */}
          <div className="max-w-xl">
            {/* <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary-content/10 px-4 py-2 text-sm backdrop-blur">
              <Sparkles size={16} />
              Plateforme académique moderne
            </div> */}

            <h2 className="font-heading text-5xl leading-tight">
              Gérez votre parcours académique avec simplicité.
            </h2>

            <p className="mt-6 text-lg text-primary-content/80leading-relaxed">
              Une solution pensée pour accompagner les candidats, étudiants et
              équipes administratives dans leurs démarches.
            </p>
          </div>

          <div className="text-sm text-primary-content/70">
            Kesmond International University
          </div>
        </div>
      </section>

      {/* AUTH PANEL */}
      <section className="flex w-full lg:w-2/5 items-center justify-center px-6 py-12 relative">
        {/* Background decoration */}
        <div className="absolute top-10 right-10 size-40 rounded-full bg-white blur-3xl" />

        <div className="relative w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 text-center">
            <Link href="/">
              <div className="mx-auto mb-5  flex size-20 items-center justify-center rounded-2xl bg-primary text-primary-content shadow-xl">
                <GraduationCap size={38} />
              </div>
            </Link>

            <h1 className="font-heading text-4xltext-primary">KesTraining</h1>

            <p className="mt-3 text-base-content/60 leading-relaxed">
              Plateforme officielle de gestion des candidatures et inscriptions.
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-3xl border border-base-300 bg-base-100/80 backdrop-blur shadow-2xl overflow-hidden">
            <div className="p-8">
              <div className="mb-8">
                <h2 className="font-heading text-3xl">{title}</h2>

                <p className="mt-2 text-sm text-base-content/60 ">
                  {description}
                </p>
              </div>

              {children}
            </div>
          </div>

          {/* Footer */}

          <div className="mt-8 text-center text-sm text-base-content/50">
            <p>Kesmond International University</p>

            <p className="mt-1">© {new Date().getFullYear()} KesTraining</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AuthLayout;
