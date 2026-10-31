"use client";

import {
  LayoutDashboard,
  User,
  LogOut,
  Menu,
  X,
  Layers,
  GraduationCap,
  Waves,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import Image from "next/image";
import { useAdminUIStore } from "@/store/useUIStore";
import { UserDropDown } from "./UserDropDown";
import {
  ModalContentType,
  ModalRoot,
} from "@/components/molecules/modal/ModalRoot";

export type NavLink = {
  name: string;
  icon?: ReactNode;
  to: string;
};

const navLinks: NavLink[] = [
  {
    name: "Acceuil",
    to: "/admin/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    name: "Vagues",
    to: "/admin/waves",
    icon: <Waves size={20} />,
  },
  {
    name: "Etudiants",
    to: "/admin/students",
    icon: <User size={20} />,
  },
  {
    name: "Inscription",
    to: "/admin/inscriptions",
    icon: <ClipboardList size={20} />,
  },
  {
    name: "Formations",
    to: "/admin/trainings",
    icon: <GraduationCap size={20} />,
  },
  {
    name: "Parcours",
    to: "/admin/programs",
    icon: <Layers size={20} />,
  },
];

function isActiveNavLink(pathname: string, current: string) {
  if (pathname === "/admin" && current === "/admin/dashboard") {
    return true;
  }

  if (
    pathname.includes("training-programs") &&
    current === "/admin/trainings"
  ) {
    return true;
  }

  return pathname.startsWith(current);
}

export default function AdminPageLayout({
  children,
  modalContent,
}: Readonly<{
  children: React.ReactNode;
  modalContent: ModalContentType;
}>) {
  const {
    isSidebarOpen,
    isMinimized,
    toggleSidebar,
    closeSidebar,
    toggleMinimize,
  } = useAdminUIStore();
  const pathname = usePathname();

  const handleMenuClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      toggleSidebar();
    } else {
      toggleMinimize();
    }
  };

  return (
    <div className="relative flex min-h-screen bg-base-100">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          flex flex-col border-r border-border border-primary/10 
          fixed lg:static inset-y-0 left-0 z-50 bg-base-100
          transition-all duration-300 ease-in-out
          ${isMinimized ? "lg:w-20" : "lg:w-64"}
          w-64
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Brand */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-primary-content/10 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <Image
              src="/images/logo.png"
              width={32}
              height={32}
              alt="logo"
              className="rounded-md shrink-0"
            />
            <p
              className={`font-heading text-xl font-extrabold leading-tight whitespace-nowrap transition-opacity duration-200 text-primary ${
                isMinimized ? "lg:opacity-0 lg:w-0" : "opacity-100"
              }`}
            >
              KesTraining
            </p>
          </div>
          <button
            onClick={closeSidebar}
            className="lg:hidden ml-2 p-1 rounded-md border hover:bg-primary/10 text-primary"
          >
            <X size={20} />
          </button>
          <div className="divide divide-base-300 h-2"></div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-3 overflow-y-auto">
          {navLinks.map((navLink) => {
            const isActive = isActiveNavLink(pathname, navLink.to);
            return (
              <div
                // className={`w-full ${isMinimized ? "tooltip tooltip-right tooltip-start z-90" : ""}: ""`}
                data-tip={navLink.name}
                key={navLink.name}
              >
                <Link
                  href={navLink.to}
                  title={isMinimized ? navLink.name : undefined}
                  onClick={() => closeSidebar()}
                  className={`relative flex flex-row ${isMinimized ? "md:flex-col" : ""} gap-3 font-sans items-center capitalize py-2.5 px-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-white font-semibold backdrop-blur-md"
                      : "text-primary font-semibold hover:bg-primary/10 hover:text-primary"
                  } ${isMinimized ? "lg:justify-center p-3" : ""}`}
                >
                  <span className="shrink-0">{navLink.icon}</span>
                  <span
                    className={`whitespace-nowrap transition-all duration-200 ${
                      isMinimized ? "lg:hidden" : ""
                    }`}
                  >
                    {navLink.name}
                  </span>
                </Link>
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar — chrome neutre, cohérent sur tous les breakpoints */}
        <header
          className=" h-16 px-4 lg:px-8 bg-white backdrop-blur-md border-b border-border shadow-xs
        sticky top-0 z-30  flex items-center justify-between border-primary/10  shrink-0"
        >
          <button
            onClick={handleMenuClick}
            className="hover:bg-base-200 text-primary  cursor-pointer p-2 rounded-full transition-colors md:text-base-content/70   hover:text-primary"
          >
            <Menu size={20} />
          </button>
          <h3 className="text-center font-bold text-primary text-sm md:text-lg md:text-left">
            KESMOND INTERNATIONAL UNIVERSITY
          </h3>
          <div className="flex items-center gap-1">
            <UserDropDown />
          </div>
        </header>
        {/* Page Content */}
        <main className="h-full relative flex-1 overflow-auto bg-base-100 font-sans">
          <div className="max-w-7xl mx-auto p-8 mb-10">
            {children}
            <ModalRoot modalContentMap={modalContent} />
          </div>
        </main>
        <footer className="absolute bottom-0 w-full bg-primary/20 h-10">
          2026
        </footer>
      </div>
    </div>
  );
}
