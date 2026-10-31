"use client";

import { useState, useCallback, useEffect, useRef } from "react";

export type PersistStorageType = "session" | "local";

export type StepPersistOptions = {
  /** Clé unique de stockage pour l'étape (ex: "kestraining-inscription:step") */
  key: string;
  storage?: PersistStorageType;
  /** Nombre total d'étapes, pour valider la valeur restaurée */
  maxStep: number;
  /** Si false, le hook se comporte comme un simple useState (aucune I/O storage) */
  enabled?: boolean;
};

function getStorageEngine(type: PersistStorageType) {
  if (typeof window === "undefined") return null;
  return type === "local" ? window.localStorage : window.sessionStorage;
}

function readStep(
  key: string,
  storage: PersistStorageType,
  maxStep: number,
): number {
  const engine = getStorageEngine(storage);
  if (!engine) return 0;
  try {
    const raw = engine.getItem(key);
    const parsed = raw !== null ? Number(raw) : NaN;
    return Number.isInteger(parsed) && parsed >= 0 && parsed < maxStep
      ? parsed
      : 0;
  } catch {
    return 0;
  }
}

/**
 * Hook à responsabilité unique : gère l'index d'étape courant en mémoire,
 * et expose une action EXPLICITE `commitStep` pour l'écrire dans le storage.
 *
 * Aucune écriture automatique : le consommateur décide QUAND persister
 * (typiquement : après succès du `handle` d'une étape, pas à chaque navigation).
 */
export function useStepPersistence(options: StepPersistOptions) {
  const { key, storage = "session", maxStep, enabled = true } = options;

  // Lecture initiale unique (lazy init) : restaure la dernière étape validée
  const [step, setStep] = useState<number>(0);
  const [isRestored, setIsRestored] = useState(false);
  const didRestore = useRef(false);

  useEffect(() => {
    if (didRestore.current) return; // protège du double-run en dev StrictMode
    didRestore.current = true;

    if (enabled) {
      setStep(readStep(key, storage, maxStep)); // ← ON LIT le storage, on ne reset pas à 0
    }
    setIsRestored(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // volontairement vide : restauration UNIQUEMENT au premier montage

  const goToStep = useCallback(
    (value: number | ((prev: number) => number)) => {
      setStep((prev) => {
        const next =
          typeof value === "function"
            ? (value as (p: number) => number)(prev)
            : value;
        return Math.min(Math.max(next, 0), maxStep - 1);
      });
    },
    [maxStep, setStep],
  );
  /**
   * Change l'étape en mémoire UNIQUEMENT, sans toucher au storage.
   * Utilisé pour reculer (previousStep), ou toute navigation qui ne
   * constitue pas une soumission validée.
   */
  // const goToStep = useCallback(
  //   (value: number | ((prev: number) => number)) => {
  //     setStep((prev) => {
  //       const next =
  //         typeof value === "function"
  //           ? (value as (p: number) => number)(prev)
  //           : value;
  //       return Math.min(Math.max(next, 0), maxStep - 1);
  //     });
  //   },
  //   [maxStep],
  // );

  /**
   * Change l'étape ET persiste dans le storage.
   * À appeler UNIQUEMENT après une soumission réussie de l'étape courante
   * (ex: dans nextStep, après que `handle` a retourné true).
   */
  const commitStep = useCallback(
    (value: number | ((prev: number) => number)) => {
      setStep((prev) => {
        const next =
          typeof value === "function"
            ? (value as (p: number) => number)(prev)
            : value;
        const clamped = Math.min(Math.max(next, 0), maxStep - 1);

        if (enabled) {
          const engine = getStorageEngine(storage);
          try {
            engine?.setItem(key, String(clamped));
          } catch {
            // storage indisponible (mode privé, quota plein...) -> on ignore
          }
        }

        return clamped;
      });
    },
    [key, storage, maxStep, enabled, setStep],
  );

  const clearStep = useCallback(() => {
    if (!enabled) return;
    try {
      getStorageEngine(storage)?.removeItem(key);
    } catch {
      // ignore
    }
  }, [key, storage, enabled]);

  return { step, goToStep, commitStep, clearStep, isRestored };
}
