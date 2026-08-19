import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OrderTracker } from "@/components/OrderTracker";
import { getOrder } from "@/lib/data/orders";

export const dynamic = "force-dynamic";

export default async function SuiviPage(props: PageProps<"/suivi/[orderId]">) {
  const { orderId } = await props.params;
  const order = await getOrder(orderId);

  if (!order) notFound();

  return (
    <>
      <Header />
      <main className="flex-1 max-w-2xl w-full mx-auto px-6 py-14">
        <h1 className="font-serif font-bold text-4xl text-bois mb-2">
          Suivi de commande
        </h1>
        <p className="text-noir/70 mb-10">
          Cette page se met à jour automatiquement à chaque changement de statut.
        </p>
        <OrderTracker initialOrder={order} />
      </main>
      <Footer />
    </>
  );
}
