"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, RotateCcw, AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 px-6 py-12">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="relative inline-block">
          <p className="font-heading text-[7rem] sm:text-[9rem] font-bold leading-none text-error/10 select-none">
            500
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <AlertTriangle
              className="w-12 h-12 sm:w-16 sm:h-16 text-error"
              strokeWidth={1.5}
            />
          </div>
        </div>

        {/* Texte */}
        <div className="space-y-3">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-base-content">
            Une erreur est survenue
          </h1>
          <p className="text-base-content/70 text-base sm:text-lg max-w-md mx-auto">
            Quelque chose s'est mal passé de notre côté. Réessayez, ou revenez à
            l'accueil si le problème persiste.
          </p>
        </div>

        {/* Détail technique (dev uniquement) */}
        {process.env.NODE_ENV === "development" && (
          <div
            className="alert alert-error
           text-left text-sm text-base-300 max-w-lg mx-auto"
          >
            <span className="font-mono break-all">{error.message}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="btn btn-primary btn-lg gap-2 w-full sm:w-auto"
          >
            <RotateCcw className="w-5 h-5" />
            Réessayer
          </button>
          <Link
            href="/"
            className="btn btn-ghost btn-lg gap-2 w-full sm:w-auto"
          >
            <Home className="w-5 h-5" />
            Retour à l'accueil
          </Link>
        </div>

        {/* Référence pour le support */}
        {error.digest && (
          <p className="pt-6 border-t border-border/60 text-xs text-base-content/50 font-mono">
            Code de référence : {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
