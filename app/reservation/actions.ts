"use server";

import { createClient } from "@/lib/supabase/server";
import { sendTransactionalEmail } from "@/lib/brevo";
import { reservationConfirmationEmail } from "@/lib/emails/reservation-confirmation";
import { TABLE_OPTIONS } from "@/lib/tables";

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
  const tableChoiceRaw = String(formData.get("tableChoice") ?? "").trim();
  const tableChoice = TABLE_OPTIONS.includes(tableChoiceRaw as (typeof TABLE_OPTIONS)[number])
    ? tableChoiceRaw
    : null;

  if (!name || !email || !date || !time || !Number.isFinite(partySize) || partySize < 1) {
    return { error: "Merci de remplir tous les champs obligatoires." };
  }

  const supabase = await createClient();
  const baseRow = {
    name,
    phone: phone || null,
    email,
    party_size: partySize,
    reservation_date: date,
    reservation_time: time,
    notes: notes || null,
  };

  let { error } = await supabase
    .from("reservations")
    .insert({ ...baseRow, table_choice: tableChoice });

  // table_choice column may not exist yet if the migration hasn't landed —
  // fall back to inserting without it rather than failing the reservation.
  if (error?.code === "PGRST204") {
    ({ error } = await supabase.from("reservations").insert(baseRow));
  }

  if (error) {
    return { error: "Impossible d'enregistrer la réservation. Réessayez." };
  }

  try {
    await sendTransactionalEmail({
      to: { email, name },
      subject: "Votre réservation à la Guinguette A&M",
      htmlContent: reservationConfirmationEmail({
        name,
        date,
        time,
        partySize,
        tableChoice,
      }),
    });
  } catch (emailError) {
    console.error("Reservation confirmation email failed", emailError);
  }

  return { success: true };
}
