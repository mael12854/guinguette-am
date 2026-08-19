"use server";

import { createClient } from "@/lib/supabase/server";

export interface CartLine {
  menuItemId: string;
  optionId: string | null;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

export async function submitOrder(
  customerName: string,
  tableLabel: string,
  lines: CartLine[],
  notes?: string
): Promise<{ orderId: string } | { error: string }> {
  const name = customerName.trim();
  if (!name) return { error: "Merci d'indiquer votre nom." };
  if (lines.length === 0) return { error: "Votre panier est vide." };

  const supabase = await createClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name: name,
      table_label: tableLabel.trim() || null,
      notes: notes?.trim() || null,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return { error: "Impossible de créer la commande. Réessayez." };
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    lines.map((line) => ({
      order_id: order.id,
      menu_item_id: line.menuItemId,
      option_id: line.optionId,
      quantity: line.quantity,
      unit_price: line.unitPrice,
      notes: line.notes || null,
    }))
  );

  if (itemsError) {
    return { error: "Impossible d'enregistrer les articles. Réessayez." };
  }

  return { orderId: order.id };
}
