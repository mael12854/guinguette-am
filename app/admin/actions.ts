"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { MenuCategory } from "@/lib/types";

async function requireStaff() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autorisé.");
  return supabase;
}

export async function createMenuItem(formData: FormData) {
  const supabase = await requireStaff();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = Number(formData.get("price"));
  const category = String(formData.get("category") ?? "plat") as MenuCategory;

  if (!name || !Number.isFinite(price)) return;

  await supabase.from("menu_items").insert({
    name,
    description: description || null,
    price,
    category,
  });

  revalidatePath("/admin");
  revalidatePath("/carte");
}

export async function updateMenuItem(formData: FormData) {
  const supabase = await requireStaff();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = Number(formData.get("price"));
  const category = String(formData.get("category") ?? "plat") as MenuCategory;

  if (!id || !name || !Number.isFinite(price)) return;

  await supabase
    .from("menu_items")
    .update({ name, description: description || null, price, category })
    .eq("id", id);

  revalidatePath("/admin");
  revalidatePath("/carte");
}

export async function toggleAvailability(id: string, isAvailable: boolean) {
  const supabase = await requireStaff();
  await supabase.from("menu_items").update({ is_available: isAvailable }).eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/carte");
}

export async function deleteMenuItem(id: string) {
  const supabase = await requireStaff();
  await supabase.from("menu_items").delete().eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/carte");
}

export async function addOption(formData: FormData) {
  const supabase = await requireStaff();
  const menuItemId = String(formData.get("menuItemId") ?? "");
  const label = String(formData.get("label") ?? "").trim();
  const extraPrice = Number(formData.get("extraPrice") ?? 0) || 0;

  if (!menuItemId || !label) return;

  await supabase.from("menu_item_options").insert({
    menu_item_id: menuItemId,
    label,
    extra_price: extraPrice,
  });

  revalidatePath("/admin");
  revalidatePath("/carte");
}

export async function deleteOption(id: string) {
  const supabase = await requireStaff();
  await supabase.from("menu_item_options").delete().eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/carte");
}
