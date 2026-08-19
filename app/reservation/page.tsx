import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ReservationForm } from "@/components/ReservationForm";

export default function ReservationPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-14">
        <h1 className="font-serif font-bold text-4xl text-bois mb-2">Réservation</h1>
        <p className="text-noir/70 mb-10 max-w-md">
          Réservez votre table à la Guinguette A&amp;M — grande salle, verrière et
          babyfoot vous attendent.
        </p>
        <ReservationForm />
      </main>
      <Footer />
    </>
  );
}
