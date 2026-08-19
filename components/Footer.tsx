export function Footer() {
  return (
    <footer className="bg-noir text-[oklch(0.75_0.03_70)] mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-4">
        <div>
          <h2 className="font-serif font-semibold text-lg text-[oklch(0.9_0.02_75)] mb-2">
            Notre histoire
          </h2>
          <p className="text-sm leading-relaxed max-w-2xl">
            Abel et Maël se connaissent depuis trois ans. En 2026, ils ouvrent leur
            guinguette dans la salle des grands-parents de Maël : une grande pièce aux
            poutres apparentes, une verrière qui laisse entrer le soleil, un babyfoot
            dans un coin, et vue sur la rivière. On n&apos;a pas grand-chose — quelques
            boissons fraîches, une mousse au chocolat maison, de quoi grignoter — mais
            tout est fait avec soin, entre amis.
          </p>
        </div>
        <div>
          <h2 className="font-serif font-semibold text-lg text-[oklch(0.9_0.02_75)] mb-2">
            Les Studios A&amp;M
          </h2>
          <p className="text-sm leading-relaxed max-w-2xl">
            En dehors de la guinguette, Abel et Maël animent aussi{" "}
            <a
              href="https://beta-les-studios-aetm.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[oklch(0.85_0.05_60)] underline hover:text-blanc-casse"
            >
              Les Studios A&amp;M
            </a>
            , un collectif de création — cinéma, théâtre — fondé avec Maya (caméra) et
            Martin (musique). Écriture, mise en scène, tournage, montage : ils font
            leurs films et pièces de A à Z.
          </p>
        </div>
        <p className="font-serif italic text-base text-[oklch(0.85_0.05_60)]">
          &quot;A&amp;M&quot; pour Abel &amp; Maël — deux amis de trois ans qui ouvrent leur
          guinguette.
        </p>
        <p className="text-xs">Guinguette A&amp;M · Depuis 2026</p>
      </div>
    </footer>
  );
}
