import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "À propos",
};

export default function AProposPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-2xl w-full mx-auto px-6 py-14">
        <h1 className="font-serif font-bold text-4xl text-bois mb-10">Notre histoire</h1>

        <div className="flex flex-col gap-8 text-noir/80 leading-relaxed">
          <div>
            <h2 className="font-serif font-semibold text-xl text-bois mb-2">
              Abel &amp; Maël
            </h2>
            <p>
              Ils se connaissent depuis trois ans, rencontrés sur les bancs de l&apos;école.
              De ces années d&apos;études est resté un réflexe simple : se retrouver, sans
              trop se poser de questions. La guinguette en est un peu le prolongement.
            </p>
          </div>

          <div>
            <h2 className="font-serif font-semibold text-xl text-bois mb-2">
              Une pièce qui ne demandait qu&apos;à servir
            </h2>
            <p>
              Chez les grands-parents de Maël, il y a cette grande pièce aux poutres
              apparentes, une verrière qui laisse entrer le soleil, vue sur la rivière —
              et personne ne s&apos;en servait vraiment. L&apos;idée n&apos;a pas été
              longuement mûrie : la pièce était là, alors pourquoi pas. Un babyfoot dans
              un coin, quelques tables, et en 2026 la guinguette a ouvert.
            </p>
          </div>

          <div>
            <h2 className="font-serif font-semibold text-xl text-bois mb-2">
              Le nom
            </h2>
            <p>
              &quot;Guinguette A&amp;M&quot; leur est venu presque par hasard — et il leur va
              plutôt bien : A comme Abel, M comme Maël, et un peu l&apos;esprit
              bal-populaire et sans chichis des guinguettes d&apos;autrefois.
            </p>
          </div>

          <div>
            <h2 className="font-serif font-semibold text-xl text-bois mb-2">
              Ce qu&apos;on y trouve
            </h2>
            <p>
              On n&apos;a pas grand-chose — quelques boissons fraîches, une mousse au
              chocolat maison, de quoi grignoter — mais tout est fait avec soin. Ouvert
              le week-end, petits et grands sont les bienvenus : c&apos;est pensé comme un
              endroit où l&apos;on revient, en famille ou entre amis, plutôt qu&apos;une
              adresse qu&apos;on coche une fois.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-bois/15 flex flex-col gap-2">
          <Link href="/reservation" className="text-terracotta hover:underline text-sm">
            Réserver une table →
          </Link>
          <Link href="/blog" className="text-terracotta hover:underline text-sm">
            Lire le blog →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
