"use server";

import { createClient } from "@/lib/supabase/server";

export interface ReservationFormState {
  error?: string;
  success?: boolean;
}

export async function createReservation(
  _prevState: ReservationFormState,
  formData: FormData
): Promise<ReservationFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const partySize = Number(formData.get("partySize"));
  const date = String(formData.get("date") ?? "");
  const time = String(formData.get("time") ?? "");
  const notes = String(formData.get("notes") ?? "").trim();

  if (!name || !phone || !date || !time || !Number.isFinite(partySize) || partySize < 1) {
    return { error: "Merci de remplir tous les champs obligatoires." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("reservations").insert({
    name,
    phone,
    email: email || null,
    party_size: partySize,
    reservation_date: date,
    reservation_time: time,
    notes: notes || null,
  });

  if (error) {
    return { error: "Impossible d'enregistrer la réservation. Réessayez." };
  }

  return { success: true };
}
