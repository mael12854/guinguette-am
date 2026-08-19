import Link from "next/link";
import { Logo } from "./Logo";
import { MyOrdersNavLink } from "./MyOrdersNavLink";

const NAV_LINKS = [
  { href: "/carte", label: "Carte" },
  { href: "/reservation", label: "Réservation" },
  { href: "/#infos", label: "Infos" },
];

export function Header() {
  return (
    <header className="bg-bois px-6 py-3.5 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-3">
        <Logo variant="icon" />
        <span className="font-serif font-bold text-lg text-blanc-casse">
          Guinguette A&amp;M
        </span>
      </Link>
      <nav className="flex gap-5 text-sm text-[oklch(0.85_0.02_70)]">
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
