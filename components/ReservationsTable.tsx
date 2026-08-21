"use client";

import type { Reservation } from "@/lib/types";
import { updateReservationStatus, deleteReservation } from "@/app/admin/actions";

const STATUS_LABELS: Record<Reservation["status"], string> = {
  en_attente: "En attente",
  confirmee: "Confirmée",
  annulee: "Annulée",
};

const STATUS_STYLES: Record<Reservation["status"], string> = {
  en_attente: "bg-velux/20 text-bois",
  confirmee: "bg-vert/15 text-vert",
  annulee: "bg-terracotta/10 text-terracotta",
};

export function ReservationsTable({ reservations }: { reservations: Reservation[] }) {
  if (reservations.length === 0) {
    return <p className="text-sm text-noir/60">Aucune réservation pour le moment.</p>;
  }

  return (
    <div className="overflow-x-auto border border-bois/15 rounded-sm">
      <table className="w-full text-sm">
        <thead className="bg-blanc-casse text-noir/60 text-xs uppercase tracking-wide">
          <tr>
            <th className="text-left px-4 py-3">Date</th>
            <th className="text-left px-4 py-3">Nom</th>
            <th className="text-left px-4 py-3">Contact</th>
            <th className="text-left px-4 py-3">Personnes</th>
            <th className="text-left px-4 py-3">Statut</th>
            <th className="text-left px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((r) => (
            <tr key={r.id} className="border-t border-bois/10">
              <td className="px-4 py-3 whitespace-nowrap">
                {r.reservation_date} — {r.reservation_time.slice(0, 5)}
              </td>
              <td className="px-4 py-3">{r.name}</td>
              <td className="px-4 py-3">
                <div>{r.email}</div>
                {r.phone && <div className="text-noir/50 text-xs">{r.phone}</div>}
              </td>
              <td className="px-4 py-3">{r.party_size}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[r.status]}`}
                >
                  {STATUS_LABELS[r.status]}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  {r.status === "en_attente" && (
                    <>
                      <button
                        onClick={() => updateReservationStatus(r.id, "confirmee")}
                        className="text-xs text-vert hover:underline"
                      >
                        Confirmer
                      </button>
                      <button
                        onClick={() => updateReservationStatus(r.id, "annulee")}
                        className="text-xs text-terracotta hover:underline"
                      >
                        Annuler
                      </button>
                    </>
                  )}
                  {r.status === "confirmee" && (
                    <>
                      <button
                        onClick={() => {
                          if (confirm(`Marquer la réservation de ${r.name} comme terminée ?`))
                            deleteReservation(r.id);
                        }}
                        className="text-xs text-vert hover:underline"
                      >
                        Ça y est, j&apos;ai terminé !
                      </button>
                      <button
                        onClick={() => updateReservationStatus(r.id, "annulee")}
                        className="text-xs text-terracotta hover:underline"
                      >
                        Annuler
                      </button>
                    </>
                  )}
                  {r.status === "annulee" && (
                    <button
                      onClick={() => {
                        if (confirm(`Retirer la réservation de ${r.name} de la liste ?`))
                          deleteReservation(r.id);
                      }}
                      className="text-xs text-noir/50 hover:underline"
                    >
                      Retirer
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
