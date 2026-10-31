import {
  LucideIcon,
  Mail,
  Phone,
  ChevronRight,
  LocationEdit,
} from "lucide-react";
import { FaFacebookF, FaTiktok, FaYoutube } from "react-icons/fa";
import Link from "next/link";
import { FooterNavLinks } from "./NavLinks";
import { ReactNode } from "react";
import { Partners } from "../partners";
import Image from "next/image";

export type Contact = {
  label: string;
  icon: LucideIcon;
};

export type SocialLink = {
  icon: ReactNode;
  href: string;
};

export type UtilLink = {
  label: string;
  href: string;
};

const contacts: Contact[] = [
  {
    label: "rdengineeringsol.com",
    icon: Mail,
  },
  {
    label: "+237 683 18 01 29",
    icon: Phone,
  },
  {
    label: "+237 696 55 27 88",
    icon: Phone,
  },
  {
    label: "Makepe entrée Marie-Lumière",
    icon: LocationEdit,
  },
];

const socialLinks: SocialLink[] = [
  { icon: <FaFacebookF className="text-primary" />, href: "" },
  { icon: <FaTiktok className="test-primary" />, href: "" },
  { icon: <FaYoutube className="test-primary" />, href: "" },
];

const utilsLink: UtilLink[] = Partners.filter((partner) => !!partner.link).map(
  (partner) => ({ href: partner.link!, label: partner.name }),
);

export function Footer() {
  return (
    <footer className="footer sm:footer-horizontal justify-around   bg-primary/20 w-full md:h-100 text-lg p-10">
      {/* <div className="max-w-7xl flex flex-col items-center gap-8 md:flex-row md:items-start justify-around"> */}
      <div className="w-full flex flex-col gap-5">
        <Image src={"/images/logo.png"} height={1000} width={100} alt="logo" />
        <div className="flex flex-wrap gap-3">
          {socialLinks.map(({ icon: Icon, href }, index) => (
            <Link
              className="rounded-full p-2 bg-primary/20 text-primary"
              href={href}
              key={index}
            >
              {Icon}
            </Link>
          ))}
        </div>
      </div>
      {/* utils link */}
      <div className="w-full flex flex-col gap-5">
        <h1 className="font-bold text-xl">Useful Links</h1>
        <ul className="flex flex-col gap-4">
          {utilsLink.map((link, index) => (
            <li key={index} className="flex gap-2 items-center">
              <ChevronRight className={`text-secondary`} size={16} />
              <a
                href={link.href}
                className="flex gap-2 text-primary hover:text-primary/80"
                key={link.label}
              >
                {/* <Icon size={20} className="text-secondary" /> */}
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      {/* Nav links  */}
      <div className="w-full space-y-4">
        <h1 className="font-bold text-xl">Navigation</h1>
        <FooterNavLinks />
      </div>
      {/* contacts  */}
      <div className="w-full md:w-auto space-y-4">
        <div className="font-bold space-y-4 text-xl">Contacts</div>
        <div className="flex flex-col gap-2">
          {contacts.map(({ label, icon: Icon }, index) => (
            <div
              className="flex items-center gap-2 hover:text-primary/80"
              key={index}
            >
              {<Icon size={20} className="text-secondary" />}
              <p className="text-lg text-primary"> {label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full divider" />
      {/* </div> */}
    </footer>
  );
}
