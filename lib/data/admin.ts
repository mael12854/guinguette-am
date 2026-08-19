import { createClient } from "@/lib/supabase/server";
import type { Reservation } from "@/lib/types";
import type { MenuItemWithOptions } from "@/lib/data/menu";

export async function getAllMenuItems(): Promise<MenuItemWithOptions[]> {
  const supabase = await createClient();

  const { data: items, error: itemsError } = await supabase
    .from("menu_items")
    .select("*")
    .order("category")
    .order("name");

  if (itemsError || !items) return [];

  const { data: options } = await supabase
    .from("menu_item_options")
    .select("*")
    .in(
      "menu_item_id",
      items.map((item) => item.id)
    )
    .order("sort_order");

  return items.map((item) => ({
    ...item,
    options: (options ?? []).filter((opt) => opt.menu_item_id === item.id),
  }));
}

export async function getReservations(): Promise<Reservation[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .order("reservation_date", { ascending: true })
    .order("reservation_time", { ascending: true });

  if (error || !data) return [];
  return data;
}
