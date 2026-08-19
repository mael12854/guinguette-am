"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { OrderStatus } from "@/lib/types";

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Non autorisé." };

  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
  if (error) return { error: "Impossible de mettre à jour la commande." };

  revalidatePath("/cuisine");
  return {};
}
