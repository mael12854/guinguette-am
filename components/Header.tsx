import Link from "next/link";
import { Logo } from "./Logo";
import { MyOrdersNavLink } from "./MyOrdersNavLink";

const NAV_LINKS = [
  { href: "/carte", label: "Carte" },
  { href: "/reservation", label: "Réservation" },
  { href: "/avis", label: "Avis" },
  { href: "/blog", label: "Blog" },
  { href: "/#infos", label: "Infos" },
];

export function Header() {
  return (
    <header className="bg-bois px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <Link href="/" className="flex items-center gap-3 shrink-0">
        <Logo variant="icon" />
        <span className="font-serif font-bold text-base sm:text-lg text-blanc-casse">
          Guinguette A&amp;M
        </span>
      </Link>
      <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[oklch(0.85_0.02_70)]">
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="hover:text-blanc-casse transition-colors">
            {link.label}
          </Link>
        ))}
        <MyOrdersNavLink />
      </nav>
    </header>
  );
}
