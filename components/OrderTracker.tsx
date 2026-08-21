"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { submitReview, closeOrder } from "@/app/suivi/actions";
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
  const [closed, setClosed] = useState(false);

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

  if (closed) {
    return (
      <div className="border border-vert/30 bg-vert/10 rounded-sm p-6 text-center">
        <p className="font-serif font-semibold text-lg text-bois">
          À bientôt à la Guinguette A&amp;M !
        </p>
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

      {order.status === "servie" && (
        <ReviewForm orderId={order.id} onClose={() => setClosed(true)} />
      )}
    </div>
  );
}

function ReviewForm({ orderId, onClose }: { orderId: string; onClose: () => void }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [closing, setClosing] = useState(false);

  async function handleClose() {
    setClosing(true);
    await closeOrder(orderId);
    onClose();
  }

  if (submitted) {
    return (
      <div className="border border-vert/30 bg-vert/10 rounded-sm p-6 text-center flex flex-col items-center gap-3">
        <p className="font-serif font-semibold text-lg text-bois">Merci pour votre avis !</p>
        <button
          onClick={handleClose}
          disabled={closing}
          className="text-sm text-noir/50 hover:text-bois disabled:opacity-50"
        >
          {closing ? "..." : "Ça y est, j'ai terminé !"}
        </button>
      </div>
    );
  }

  async function handleSubmit() {
    if (rating === 0) {
      setError("Choisissez une note.");
      return;
    }
    setError(null);
    setSubmitting(true);
    const result = await submitReview(orderId, rating, name, comment);
    setSubmitting(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setSubmitted(true);
  }

  return (
    <div className="border border-bois/15 rounded-sm p-6 bg-blanc-casse flex flex-col gap-3">
      <p className="font-serif font-semibold text-lg text-bois">Votre avis nous intéresse</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHoverRating(n)}
            onMouseLeave={() => setHoverRating(0)}
            className="text-3xl leading-none"
            aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
          >
            <span className={n <= (hoverRating || rating) ? "text-velux" : "text-bois/20"}>
              ★
            </span>
          </button>
        ))}
      </div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Votre nom (optionnel)"
        className="border border-bois/20 rounded-sm px-3 py-2 text-sm bg-white"
      />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Un commentaire (optionnel)"
        rows={3}
        className="border border-bois/20 rounded-sm px-3 py-2 text-sm bg-white resize-none"
      />
      {error && <p className="text-sm text-terracotta">{error}</p>}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSubmit}
          disabled={submitting || closing}
          className="inline-flex items-center justify-center text-sm font-medium px-6 py-2.5 rounded-sm transition-colors disabled:opacity-50 bg-terracotta text-blanc-casse hover:opacity-90"
        >
          {submitting ? "Envoi..." : "Envoyer mon avis"}
        </button>
        <button
          onClick={handleClose}
          disabled={submitting || closing}
          className="text-sm text-noir/50 hover:text-bois disabled:opacity-50"
        >
          {closing ? "..." : "Ça y est, j'ai terminé !"}
        </button>
      </div>
    </div>
  );
}
