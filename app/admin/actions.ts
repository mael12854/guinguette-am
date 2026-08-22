"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { MenuCategory, ReservationStatus } from "@/lib/types";

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
  const allergens = formData.getAll("allergens").map(String);

  if (!name || !Number.isFinite(price)) return;

  await supabase.from("menu_items").insert({
    name,
    description: description || null,
    price,
    category,
    allergens,
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
  const allergens = formData.getAll("allergens").map(String);

  if (!id || !name || !Number.isFinite(price)) return;

  await supabase
    .from("menu_items")
    .update({ name, description: description || null, price, category, allergens })
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

export async function updateReservationStatus(id: string, status: ReservationStatus) {
  const supabase = await requireStaff();
  await supabase.from("reservations").update({ status }).eq("id", id);
  revalidatePath("/admin");
}

export async function deleteReservation(id: string) {
  const supabase = await requireStaff();
  await supabase.from("reservations").delete().eq("id", id);
  revalidatePath("/admin");
}

function slugify(title: string) {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export async function createPost(formData: FormData) {
  const supabase = await requireStaff();
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const published = formData.get("published") === "on";

  if (!title || !content) return;

  const baseSlug = slugify(title) || "article";
  let slug = baseSlug;
  let attempt = 0;
  let insertError = null;

  do {
    const { error } = await supabase.from("posts").insert({
      title,
      slug,
      excerpt: excerpt || null,
      content,
      published,
    });
    insertError = error;
    if (error?.code === "23505") {
      attempt += 1;
      slug = `${baseSlug}-${attempt + 1}`;
    }
  } while (insertError?.code === "23505" && attempt < 5);

  revalidatePath("/admin");
  revalidatePath("/blog");
}

export async function updatePost(formData: FormData) {
  const supabase = await requireStaff();
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const published = formData.get("published") === "on";

  if (!id || !title || !content) return;

  await supabase
    .from("posts")
    .update({ title, excerpt: excerpt || null, content, published })
    .eq("id", id);

  revalidatePath("/admin");
  revalidatePath("/blog");
}

export async function deletePost(id: string) {
  const supabase = await requireStaff();
  await supabase.from("posts").delete().eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/blog");
}
