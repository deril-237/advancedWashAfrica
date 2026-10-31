import { LucideIcon, ArrowUpRight } from "lucide-react";
import { Banner } from "../../_components/Banners";
import Link from "next/link";
import { CallToAction } from "../../_components/CallToAction";

export type ObjectiveCardProps = {
  icon: LucideIcon;
  description: string;
  colSpan?: "col-span-1" | "col-span-2";
  title: string;
  bg?: "bg-primary";
  index: number;
};

export function ObjectiveCard({
  index,
  description,
  title,
  icon: Icon,
  bg,
  colSpan = "col-span-1",
}: ObjectiveCardProps) {
  const featured = Boolean(bg);

  return (
    <article
      className={`
        group relative min-h-70 overflow-hidden rounded-3xl
        border p-7
        transition-all duration-500
        hover:-translate-y-1.5 hover:shadow-2xl
        ${colSpan}
        ${
          featured
            ? "border-primary bg-primary text-white"
            : "border-base-300 bg-base-100 text-base-content hover:border-primary/30"
        }
      `}
    >
      {/* Background decoration */}
      <div
        className={`
          absolute -right-12 -top-12 size-36 rounded-3xl
          transition-transform duration-500
          
          ${
            featured
              ? "bg-white/5"
              : index % 2 === 0
                ? "bg-primary/5"
                : "bg-secondary/10"
          }
        `}
      />

      {/* <div
        className={`
          absolute bottom-0 right-0 h-1 w-0
          transition-all duration-500
          group-hover:w-full
          ${featured ? "bg-secondary" : "bg-primary"}
        `}
      /> */}

      <div className="relative z-10 flex h-full flex-col">
        {/* Top */}
        <div className="flex items-start justify-between">
          <div
            className={`
              flex size-14 items-center justify-center rounded-2xl
              transition-transform duration-500
              group-hover:rotate-3 group-hover:scale-105
              ${
                featured
                  ? "bg-secondary text-primary"
                  : "bg-primary/10 text-primary"
              }
            `}
          >
            <Icon size={26} strokeWidth={1.8} />
          </div>

          <span
            className={`
              text-5xl font-black leading-none
              ${featured ? "text-white/10" : "text-primary/5"}
            `}
          >
            {String(index).padStart(2, "0")}
          </span>
        </div>

        {/* Content */}
        <div className="mt-auto pt-12">
          <div className="mb-3 flex items-center gap-2">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                featured ? "bg-secondary" : "bg-secondary"
              }`}
            />

            <span
              className={`text-xs font-bold uppercase tracking-[0.18em] ${
                featured ? "text-secondary" : "text-primary/60"
              }`}
            >
              Objectif {String(index).padStart(2, "0")}
            </span>
          </div>

          <div className="flex items-start justify-between gap-4">
            <h3
              className={`
                max-w-lg text-xl font-bold leading-tight sm:text-2xl
                ${featured ? "text-white" : "text-primary"}
              `}
            >
              {title}
            </h3>

            <div
              className={`
                hidden size-9 shrink-0 items-center justify-center rounded-full
                opacity-0 transition-all duration-300
                group-hover:translate-x-0 group-hover:opacity-100 sm:flex
                ${
                  featured
                    ? "bg-white/10 text-secondary"
                    : "bg-primary/10 text-primary"
                }
              `}
            >
              <ArrowUpRight size={18} />
            </div>
          </div>

          <p
            className={`
              mt-3 max-w-2xl text-sm leading-6
              ${featured ? "text-white/65" : "text-base-content/60"}
            `}
          >
            {description}
          </p>
        </div>
      </div>
    </article>
  );
}
