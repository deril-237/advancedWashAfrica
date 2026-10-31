"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  GraduationCap,
  House,
  LucideIcon,
  Phone,
  Target,
  User,
} from "lucide-react";

type NavLInk = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const navLinks: NavLInk[] = [
  { label: "Home", href: "/", icon: House },
  { label: "Trainings", href: "/trainings", icon: GraduationCap },
  { label: "About us", href: "/about-us", icon: Target },
  { label: "Contacts", href: "/contacts", icon: Phone },
];

export function isActive(href: string, pathname: string) {
  console.log();
  if (pathname !== "/" && href === "/") {
    return false;
  }
  return pathname.startsWith(href);
}

export function HeaderNavLinks() {
  const pathname = usePathname();
  return (
    <nav className="flex items-center gap-8 text-lg">
      {navLinks.map((link) => (
        <Link
          href={link.href}
          className="flex flex-col items-center group"
          key={link.label}
        >
          <p className="text-primary">{link.label}</p>
          <div
            className={clsx(
              "transition-all transition-duration-200 h-0.5 w-0 group-hover:bg-secondary group-hover:rounded-lg group-hover:w-2/3",
              isActive(link.href, pathname)
                ? "bg-secondary rounded-lg w-2/3"
                : "",
            )}
          ></div>
        </Link>
      ))}
    </nav>
  );
}

export function FooterNavLinks() {
  return (
    <nav className="flex flex-col gap-2">
      {navLinks.map(({ icon: Icon, ...link }) => (
        <Link
          href={link.href}
          className="flex gap-2 text-primary hover:text-primary/80"
          key={link.label}
        >
          <Icon size={20} className="text-secondary" />
          {link.label}
        </Link>
      ))}
      <Link
        href={"/auth/signin"}
        className="flex gap-2 text-primary hover:text-primary/80 text-nowrap"
      >
        <User size={20} className="text-secondary" />
        Login
      </Link>
    </nav>
  );
}
