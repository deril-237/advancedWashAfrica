"use client";

import { FileText, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { HeaderNavLinks, isActive, navLinks } from "./NavLinks";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/betterAuth/auth-client";
import { UserDropDown } from "./UserDropDown";

export function Header() {
  const [isOpen, setOpen] = useState(false);
  const pathname = usePathname();
  const { data } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100/90 backdrop-blur-lg">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="Kesmonds" width={64} height={48} />
          <div className="font-bold text-sm">
            <p className="text-primary text-base">ADVANCED</p>
            <p className="text-blue-600">WASH AFRICA</p>
          </div>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-8 md:flex">
          <HeaderNavLinks />

          {data ? (
            <UserDropDown />
          ) : (
            <Link
              href="/inscription"
              className="btn btn-primary rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              <FileText size={18} />
              Subscribe
            </Link>
          )}
        </div>

        {/* Mobile */}
        <button
          className="btn btn-square btn-ghost md:hidden"
          onClick={() => setOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden border-t border-base-300 bg-base-100 transition-all duration-500 md:hidden ${
          isOpen ? "max-h-125 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-2 p-4">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className={`btn justify-start ${isActive(href, pathname) ? "btn-primary" : "btn-ghost"}`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}

          <div className="divider my-2"></div>

          <Link
            href="/inscription"
            className="btn btn-primary w-full rounded-xl"
            onClick={() => setOpen(false)}
          >
            <FileText size={18} />
            Subscribe
          </Link>
        </nav>
      </div>
    </header>
  );
}
