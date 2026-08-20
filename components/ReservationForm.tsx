"use client";

import { useActionState } from "react";
import { Button } from "@/components/Button";
import { createReservation, type ReservationFormState } from "@/app/reservation/actions";

const initialState: ReservationFormState = {};

export function ReservationForm() {
  const [state, action, pending] = useActionState(createReservation, initialState);

  if (state.success) {
    return (
      <div className="border border-vert/30 bg-vert/10 rounded-sm p-6 text-noir">
        <p className="font-serif font-semibold text-lg text-bois mb-1">
          Réservation envoyée !
        </p>
        <p className="text-sm text-noir/70">
          Nous vous recontacterons pour la confirmer.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4 max-w-md">
      <Field label="Nom" name="name" required />
      <Field label="Email" name="email" type="email" required />
      <Field label="Téléphone (optionnel)" name="phone" type="tel" />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Date" name="date" type="date" required />
        <Field label="Heure" name="time" type="time" required />
      </div>
      <Field label="Nombre de personnes" name="partySize" type="number" min={1} required />
      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-wide text-noir/60">
          Message (optionnel)
        </label>
        <textarea
          name="notes"
          rows={3}
          className="border border-bois/20 rounded-sm px-3 py-2 text-sm bg-white"
        />
      </div>

      {state.error && <p className="text-sm text-terracotta">{state.error}</p>}

      <Button type="submit" disabled={pending} className="mt-2 self-start">
        {pending ? "Envoi..." : "Réserver"}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  min,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  min?: number;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-xs uppercase tracking-wide text-noir/60">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        min={min}
        className="border border-bois/20 rounded-sm px-3 py-2 text-sm bg-white"
      />
    </div>
  );
}
