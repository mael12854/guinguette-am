"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";
import { getMyOrderIds, setMyOrderIds } from "@/lib/my-orders";
import type { OrderStatus } from "@/lib/types";

const ACTIVE_STATUSES: OrderStatus[] = ["nouvelle", "en_preparation", "prete"];

const STATUS_LABELS: Record<OrderStatus, string> = {
  nouvelle: "Nouvelle",
  en_preparation: "En préparation",
  prete: "Prête",
  servie: "Servie",
  annulee: "Annulée",
};

interface ActiveOrder {
  id: string;
  customer_name: string;
  table_label: string | null;
  status: OrderStatus;
}

export default function MesCommandesPage() {
  const [orders, setOrders] = useState<ActiveOrder[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      const ids = getMyOrderIds();
      if (ids.length === 0) {
        if (!cancelled) setOrders([]);
        return;
      }

      const supabase = createClient();
      const { data } = await supabase
        .from("orders")
        .select("id, customer_name, table_label, status")
        .in("id", ids)
        .order("created_at", { ascending: false });

      const stillTracked = (data ?? []).map((o) => o.id);
      if (stillTracked.length !== ids.length) {
        setMyOrderIds(stillTracked);
      }

      const active = (data ?? []).filter((o) =>
        ACTIVE_STATUSES.includes(o.status as OrderStatus)
      ) as ActiveOrder[];

      if (!cancelled) setOrders(active);
    }

    refresh();
    const interval = setInterval(refresh, 10000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <Header />
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-14">
        <h1 className="font-serif font-bold text-4xl text-bois mb-2">
          Vos commandes en cours
        </h1>
        <p className="text-noir/70 mb-10">
          Cette page se met à jour automatiquement.
        </p>

        {orders === null && <p className="text-sm text-noir/60">Chargement...</p>}

        {orders?.length === 0 && (
          <p className="text-sm text-noir/60">
            Aucune commande en cours.{" "}
            <Link href="/carte" className="text-terracotta hover:underline">
              Voir la carte
            </Link>
          </p>
        )}

        <div className="flex flex-col gap-4">
          {orders?.map((order) => (
            <Link
              key={order.id}
              href={`/suivi/${order.id}`}
              className="border border-bois/15 rounded-sm p-5 bg-blanc-casse flex items-center justify-between hover:border-terracotta transition-colors"
            >
              <div>
                <div className="font-serif font-semibold text-lg text-bois">
                  {order.customer_name}
                  {order.table_label ? ` — ${order.table_label}` : ""}
                </div>
                <div className="text-xs text-noir/60 mt-1">Voir le suivi</div>
              </div>
              <span className="text-xs uppercase tracking-wide px-3 py-1.5 rounded-full bg-vert/15 text-vert">
                {STATUS_LABELS[order.status]}
              </span>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
