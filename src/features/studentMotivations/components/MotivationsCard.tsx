import EmptyState from "@/components/atoms/EmptyState";
import { MessageSquareQuote, Quote } from "lucide-react";
import { StudentMotivations } from "../types";

export function MotivationsCard({
  motivations,
}: {
  motivations: StudentMotivations;
}) {
  return (
    <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
      <h3 className="font-heading text-base font-semibold mb-5 flex items-center gap-2 text-primary">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/8 ring-1 ring-primary/10">
          <MessageSquareQuote size={17} />
        </span>
        Motivation
      </h3>

      {motivations.length === 0 ? (
        <EmptyState
          icon={
            <MessageSquareQuote size={22} className="text-base-content/40" />
          }
          title="Aucune réponse"
          description="L'étudiant n'a pas encore renseigné de motivation."
        />
      ) : (
        <div className="space-y-5">
          {motivations.map((motivation) => (
            <div key={motivation.id}>
              {!motivation.option ? (
                <p className="text-xs font-medium text-base-content/50 uppercase tracking-wide mb-2">
                  Réponse libre
                </p>
              ) : null}

              <div className="relative rounded-xl bg-base-200/50 border-l-4 border-l-secondary pl-5 pr-4 py-4">
                <Quote
                  size={26}
                  className="absolute -top-2 left-3 text-secondary/25 rotate-180"
                  strokeWidth={1.5}
                />
                <p className="font-serif font-bold italic text-[15px] leading-relaxed text-base-content/75">
                  {motivation.textResponse || motivation.option?.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
