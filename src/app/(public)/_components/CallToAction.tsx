import { ReactNode } from "react";

export function CallToAction({ children }: { children: ReactNode }) {
  return (
    <section className="px-4 pb-20 sm:px-6 lg:px-8">
      <div className="relative mx-auto flex max-w-7xl flex-col items-center overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center shadow-xl sm:px-12">
        {/* Decorative circles */}
        <div className="absolute -right-20 -top-20 size-64 rounded-full border-40 border-secondary/20" />
        <div className="absolute -bottom-24 -left-20 size-72 rounded-full border-50 border-white/5" />

        <div className="relative z-10 max-w-2xl">{children}</div>
      </div>
    </section>
  );
}
