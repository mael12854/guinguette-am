import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/Button";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="max-w-5xl mx-auto px-6 py-20 flex flex-col gap-6">
          <span className="text-xs uppercase tracking-[0.2em] text-terracotta">
            Guinguette A&amp;M
          </span>
          <h1 className="font-serif font-bold text-4xl sm:text-5xl text-bois leading-tight max-w-2xl">
            Une grande salle, deux amis
          </h1>
          <p className="text-base text-noir/80 max-w-lg leading-relaxed">
            Poutres en bois, verrière, babyfoot dans le coin — la carte, les
            horaires, la réservation.
          </p>
          <div className="flex gap-3 pt-2">
            <Link href="/reservation">
              <Button variant="filled">Réserver</Button>
            </Link>
            <Link href="/carte">
              <Button variant="outline">Voir la carte</Button>
            </Link>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 pb-16">
          <div className="grid sm:grid-cols-3 gap-6">
            <Feature
              title="Grande salle"
              description="Poutres en bois et verrière, pour de grandes tablées et des soirées qui s'étirent."
            />
            <Feature
              title="Babyfoot"
              description="Une partie en attendant les crêpes, une autre après le café."
            />
            <Feature
              title="Fait maison"
              description="Boissons fraîches, mousse au chocolat et petites choses à grignoter."
            />
          </div>
        </section>

        <section id="infos" className="bg-blanc-casse border-y border-bois/10">
          <div className="max-w-5xl mx-auto px-6 py-14 grid sm:grid-cols-2 gap-10">
            <div>
              <h2 className="font-serif font-semibold text-2xl text-bois mb-3">
                Horaires
              </h2>
              <ul className="text-sm text-noir/80 space-y-1.5">
                <li>Mardi – Vendredi : 18h – minuit</li>
                <li>Samedi – Dimanche : midi – minuit</li>
                <li>Lundi : fermé</li>
              </ul>
            </div>
            <div>
              <h2 className="font-serif font-semibold text-2xl text-bois mb-3">
                Adresse
              </h2>
              <p className="text-sm text-noir/80 leading-relaxed">
                Guinguette A&amp;M
                <br />
                Bords de rivière
                <br />
                Réservation conseillée le week-end
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div className="border border-bois/15 rounded-sm p-6 bg-blanc-casse">
      <h3 className="font-serif font-semibold text-lg text-bois mb-2">{title}</h3>
      <p className="text-sm text-noir/70 leading-relaxed">{description}</p>
    </div>
  );
}
