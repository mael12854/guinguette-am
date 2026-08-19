"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { updateOrderStatus } from "@/app/cuisine/actions";
import type { OrderStatus } from "@/lib/types";
import type { OrderWithLines } from "@/lib/data/orders";

const NEXT_STATUS: Partial<Record<OrderStatus, { status: OrderStatus; label: string }>> = {
  nouvelle: { status: "en_preparation", label: "Démarrer" },
  en_preparation: { status: "prete", label: "Marquer prête" },
  prete: { status: "servie", label: "Marquer servie" },
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  nouvelle: "Nouvelle",
  en_preparation: "En préparation",
  prete: "Prête",
  servie: "Servie",
  annulee: "Annulée",
};

export function KitchenBoard({ orders }: { orders: OrderWithLines[] }) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("kitchen-orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => router.refresh()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "order_items" },
        () => router.refresh()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  if (orders.length === 0) {
    return <p className="text-sm text-noir/60">Aucune commande active.</p>;
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {orders.map((order) => {
        const next = NEXT_STATUS[order.status];
        return (
          <div
            key={order.id}
            className="border border-bois/15 rounded-sm p-5 bg-blanc-casse flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-serif font-semibold text-lg text-bois">
                {order.customer_name}
                {order.table_label ? ` — ${order.table_label}` : ""}
              </span>
              <span className="text-xs uppercase tracking-wide px-2 py-1 rounded-full bg-vert/15 text-vert">
                {STATUS_LABELS[order.status]}
              </span>
            </div>
            <ul className="flex flex-col gap-1 text-sm text-noir/80">
              {order.lines.map((line) => (
                <li key={line.id}>
                  {line.quantity}× {line.itemName}
                  {line.optionLabel ? ` (${line.optionLabel})` : ""}
                  {line.notes ? ` — ${line.notes}` : ""}
                </li>
              ))}
            </ul>
            {order.notes && (
              <p className="text-sm text-terracotta bg-terracotta/10 rounded-sm px-2.5 py-1.5">
                💬 {order.notes}
              </p>
            )}
            {next && (
              <button
                onClick={() => updateOrderStatus(order.id, next.status)}
                className="mt-1 self-start text-sm px-4 py-2 rounded-sm bg-terracotta text-blanc-casse hover:opacity-90"
              >
                {next.label}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
