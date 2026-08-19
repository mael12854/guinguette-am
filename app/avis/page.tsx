import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ReviewsList } from "@/components/ReviewsList";
import { getPublicReviews } from "@/lib/data/reviews";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Avis",
};

export default async function AvisPage() {
  const reviews = await getPublicReviews();

  return (
    <>
      <Header />
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-14">
        <h1 className="font-serif font-bold text-4xl text-bois mb-2">Avis</h1>
        <p className="text-noir/70 mb-10">Ce que nos visiteurs disent de la Guinguette A&amp;M.</p>
        <ReviewsList reviews={reviews} />
      </main>
      <Footer />
    </>
  );
}
