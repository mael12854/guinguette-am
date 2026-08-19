import { createClient } from "@/lib/supabase/server";
import type { Order, OrderStatus } from "@/lib/types";

export interface OrderLineDisplay {
  id: string;
  quantity: number;
  unitPrice: number;
  itemName: string;
  optionLabel: string | null;
  notes: string | null;
}

export interface OrderWithLines extends Order {
  lines: OrderLineDisplay[];
}

export async function getOrder(orderId: string): Promise<OrderWithLines | null> {
  const supabase = await createClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();

  if (orderError || !order) return null;

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("*, menu_items(name), menu_item_options(label)")
    .eq("order_id", orderId);

  if (itemsError) return { ...order, lines: [] };

  const lines: OrderLineDisplay[] = (items ?? []).map((item) => ({
    id: item.id,
    quantity: item.quantity,
    unitPrice: item.unit_price,
    itemName: (item as unknown as { menu_items: { name: string } | null }).menu_items?.name ?? "Article",
    optionLabel:
      (item as unknown as { menu_item_options: { label: string } | null }).menu_item_options?.label ?? null,
    notes: item.notes,
  }));

  return { ...order, lines };
}

export async function getActiveOrders(): Promise<OrderWithLines[]> {
  const supabase = await createClient();
  const activeStatuses: OrderStatus[] = ["nouvelle", "en_preparation", "prete"];

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("*")
    .in("status", activeStatuses)
    .order("created_at");

  if (ordersError || !orders || orders.length === 0) return [];

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("*, menu_items(name), menu_item_options(label)")
    .in(
      "order_id",
      orders.map((o) => o.id)
    );

  const linesByOrder = new Map<string, OrderLineDisplay[]>();
  if (!itemsError) {
    for (const item of items ?? []) {
      const list = linesByOrder.get(item.order_id) ?? [];
      list.push({
        id: item.id,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        itemName:
          (item as unknown as { menu_items: { name: string } | null }).menu_items?.name ?? "Article",
        optionLabel:
          (item as unknown as { menu_item_options: { label: string } | null }).menu_item_options
            ?.label ?? null,
        notes: item.notes,
      });
      linesByOrder.set(item.order_id, list);
    }
  }

  return orders.map((order) => ({ ...order, lines: linesByOrder.get(order.id) ?? [] }));
}
