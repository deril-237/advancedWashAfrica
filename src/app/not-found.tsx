"use client";

import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 px-6 py-12">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Illustration numérique */}
        <div className="relative inline-block">
          <p className="font-heading text-[7rem] sm:text-[9rem] font-bold leading-none text-primary/10 select-none">
            404
          </p>
          <p className="absolute inset-0 flex items-center justify-center font-heading text-4xl sm:text-5xl font-bold text-primary">
            404
          </p>
        </div>

        {/* Texte */}
        <div className="space-y-3">
          <h1 className="font-sans text-2xl sm:text-3xl font-bold text-base-content">
            Oups, cette page n'existe pas
          </h1>
          <p className="text-base-content/70 text-base sm:text-lg max-w-md mx-auto">
            La page que vous cherchez a peut-être été déplacée, supprimée, ou
            n'a jamais existé.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="btn btn-primary btn-lg gap-2 w-full sm:w-auto"
          >
            <Home className="w-5 h-5" />
            Retour à l'accueil
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn btn-ghost btn-lg gap-2 w-full sm:w-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            Page précédente
          </button>
        </div>

        {/* Aide additionnelle */}
        <div className="pt-6 border-t border-border/60 flex items-center justify-center gap-2 text-sm text-base-content/60">
          <Search className="w-4 h-4" />
          <span>
            Besoin d'aide ?{" "}
            <Link href="/contact" className="link link-primary font-medium">
              Contactez le support
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
