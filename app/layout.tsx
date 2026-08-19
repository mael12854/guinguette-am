import type { Metadata } from "next";
import { Fraunces, Poppins } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const SITE_URL = "https://guinguette-am.vercel.app";
const DESCRIPTION =
  "Grande salle, poutres en bois, verrière, babyfoot — la guinguette d'Abel & Maël.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Guinguette A&M",
    template: "%s · Guinguette A&M",
  },
  description: DESCRIPTION,
  openGraph: {
    title: "Guinguette A&M",
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Guinguette A&M",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Guinguette A&M",
    description: DESCRIPTION,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${fraunces.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-creme text-noir font-sans overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
