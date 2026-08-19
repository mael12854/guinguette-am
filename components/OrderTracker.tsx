"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { OrderStatus } from "@/lib/types";
import type { OrderWithLines } from "@/lib/data/orders";

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: "nouvelle", label: "Nouvelle" },
  { status: "en_preparation", label: "En préparation" },
  { status: "prete", label: "Prête" },
  { status: "servie", label: "Servie" },
];

export function OrderTracker({ initialOrder }: { initialOrder: OrderWithLines }) {
  const [order, setOrder] = useState(initialOrder);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`order-${initialOrder.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${initialOrder.id}`,
        },
        (payload) => {
          setOrder((prev) => ({ ...prev, ...(payload.new as Partial<OrderWithLines>) }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [initialOrder.id]);

  if (order.status === "annulee") {
    return (
      <div className="border border-terracotta/30 bg-terracotta/10 rounded-sm p-6">
        <p className="font-serif font-semibold text-lg text-bois">Commande annulée</p>
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((step) => step.status === order.status);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        {STEPS.map((step, i) => (
          <div key={step.status} className="flex-1 flex flex-col items-center gap-2">
            <div
              className={`w-4 h-4 rounded-full border-2 ${
                i <= currentIndex
                  ? "bg-vert border-vert"
                  : "bg-blanc-casse border-bois/25"
              }`}
            />
            <span
              className={`text-xs text-center ${
                i <= currentIndex ? "text-bois font-medium" : "text-noir/40"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      <div className="border border-bois/15 rounded-sm p-6 bg-blanc-casse">
        <p className="text-sm text-noir/60 mb-3">
          Commande de {order.customer_name}
          {order.table_label ? ` — ${order.table_label}` : ""}
        </p>
        <ul className="flex flex-col gap-2">
          {order.lines.map((line) => (
            <li key={line.id} className="flex justify-between text-sm">
              <span>
                {line.quantity}× {line.itemName}
                {line.optionLabel ? ` (${line.optionLabel})` : ""}
              </span>
              <span className="text-noir/70">
                {(line.unitPrice * line.quantity).toFixed(2)} €
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
