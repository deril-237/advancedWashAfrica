"use client";

import { useCallback } from "react";
import { FieldValues } from "react-hook-form";
import { PersistStorageType } from "./useStepPersistence";

export type FormPersistOptions = {
  key: string;
  storage?: PersistStorageType;
  ttl?: number;
  exclude?: string[];
  enabled?: boolean;
};

type PersistedPayload<T> = {
  values: T;
  savedAt: number;
};

function getStorageEngine(type: PersistStorageType) {
  if (typeof window === "undefined") return null;
  return type === "local" ? window.localStorage : window.sessionStorage;
}

function omitKeys<T extends Record<string, unknown>>(
  obj: T,
  keys: string[],
): T {
  if (!keys.length) return obj;
  const clone = { ...obj };
  for (const k of keys) delete (clone as Record<string, unknown>)[k];
  return clone;
}

export function readPersistedFormValues<T>(
  options: Omit<FormPersistOptions, "exclude" | "enabled">,
): T | null {
  const engine = getStorageEngine(options.storage ?? "session");
  if (!engine) return null;
  try {
    const raw = engine.getItem(options.key);
    if (!raw) return null;
    const parsed: PersistedPayload<T> = JSON.parse(raw);
    if (options.ttl && Date.now() - parsed.savedAt > options.ttl) {
      engine.removeItem(options.key);
      return null;
    }
    return parsed.values;
  } catch {
    return null;
  }
}

/**
 * Hook à responsabilité unique : sait écrire/lire/effacer les valeurs
 * d'un formulaire dans le storage. N'observe RIEN automatiquement —
 * c'est au consommateur de décider QUAND appeler `persistValues`
 * (ici : entre chaque étape validée, pas à chaque frappe).
 */
export function useFormPersistence<TFormData extends FieldValues>(
  options: FormPersistOptions,
) {
  const { key, storage = "session", exclude = [], enabled = true } = options;

  const persistValues = useCallback(
    (values: TFormData) => {
      if (!enabled) return;
      const engine = getStorageEngine(storage);
      if (!engine) return;

      const payload: PersistedPayload<TFormData> = {
        values: omitKeys(values, exclude),
        savedAt: Date.now(),
      };

      try {
        engine.setItem(key, JSON.stringify(payload));
      } catch {
        // storage plein ou indisponible -> on ignore silencieusement
      }
    },
    [key, storage, exclude, enabled],
  );

  const clearValues = useCallback(() => {
    try {
      getStorageEngine(storage)?.removeItem(key);
    } catch {
      // ignore
    }
  }, [key, storage]);

  return { persistValues, clearValues };
}
