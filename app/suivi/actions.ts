"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitReview(
  orderId: string,
  rating: number,
  customerName: string,
  comment: string
): Promise<{ ok: true } | { error: string }> {
  if (rating < 1 || rating > 5) return { error: "Note invalide." };

  const supabase = await createClient();

  const { error } = await supabase.from("reviews").insert({
    order_id: orderId,
    rating,
    customer_name: customerName.trim() || null,
    comment: comment.trim() || null,
  });

  if (error) return { error: "Impossible d'enregistrer votre avis. Réessayez." };
  return { ok: true };
}

export async function closeOrder(orderId: string): Promise<{ ok: true } | { error: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("orders").delete().eq("id", orderId).eq("status", "servie");
  if (error) return { error: "Impossible de clôturer la commande." };
  return { ok: true };
}
