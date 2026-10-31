import Image from "next/image";
import { ReactNode } from "react";
import { Earth, LucideIcon } from "lucide-react";

export function Banner({
  children,
  icon: Icon = Earth,
}: {
  children: ReactNode;
  icon?: LucideIcon;
}) {
  return (
    <section className="relative overflow-hidden">
      <Image
        src="/images/banner-bg.png"
        alt="Formation humanitaire"
        fill
        priority
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-primary/90" />

      {/* Décoration */}
      <div className="absolute right-10 bottom-10 hidden lg:block opacity-10">
        <Icon className="size-80 text-base-100" />
      </div>

      <div className="relative z-10 flex items-center">{children}</div>
    </section>
  );
}
