import { createClient } from "@/lib/supabase/server";
import type { MenuItem, MenuItemOption } from "@/lib/types";

export type MenuItemWithOptions = MenuItem & { options: MenuItemOption[] };

export async function getAvailableMenu(): Promise<MenuItemWithOptions[]> {
  const supabase = await createClient();

  const { data: items, error: itemsError } = await supabase
    .from("menu_items")
    .select("*")
    .eq("is_available", true)
    .order("category")
    .order("name");

  if (itemsError) throw itemsError;
  if (!items || items.length === 0) return [];

  const { data: options, error: optionsError } = await supabase
    .from("menu_item_options")
    .select("*")
    .in(
      "menu_item_id",
      items.map((item) => item.id)
    )
    .order("sort_order");

  if (optionsError) throw optionsError;

  return items.map((item) => ({
    ...item,
    options: (options ?? []).filter((opt) => opt.menu_item_id === item.id),
  }));
}
