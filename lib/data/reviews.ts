import { createClient } from "@/lib/supabase/server";
import type { Review } from "@/lib/types";

export async function getPublicReviews(): Promise<Review[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data;
}
