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
                Où nous trouver
              </h2>
              <p className="text-sm text-noir/80 leading-relaxed">
                28bis avenue de la République, à Igny — suivez la lumière et le bruit
                du babyfoot.
                <br />
                <br />
                Réservation conseillée le week-end, surtout quand le soleil est de la
                partie.
              </p>
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-6 pb-14 grid sm:grid-cols-2 gap-6">
            <div>
              <div className="rounded-sm overflow-hidden border border-bois/15">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!4v1787648164910!6m8!1m7!1siGDSU8pY-6OrfoETpeYaFw!2m2!1d48.73401241523268!2d2.226089480134751!3f335.5992636578098!4f-4.628456086779508!5f0.7820865974627469"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="Vue depuis la rue du 28bis avenue de la République, Igny"
                  className="w-full h-[300px] border-0"
                />
              </div>
              <p className="text-xs text-noir/50 mt-2">Vue depuis la rue</p>
            </div>
            <div>
              <div className="rounded-sm overflow-hidden border border-bois/15">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2631.5028185509855!2d2.223444411930551!3d48.73409107119592!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e6785437f62ce7%3A0x3c88eb3070f2afde!2s28%20Bis%20Av.%20de%20la%20R%C3%A9publique%2C%2091430%20Igny!5e0!3m2!1sfr!2sfr!4v1787648100926!5m2!1sfr!2sfr"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="Plan d'accès au 28bis avenue de la République, Igny"
                  className="w-full h-[300px] border-0"
                />
              </div>
              <p className="text-xs text-noir/50 mt-2">Le plan</p>
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
