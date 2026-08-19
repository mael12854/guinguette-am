import type { Reservation } from "@/lib/types";

const STATUS_LABELS: Record<Reservation["status"], string> = {
  en_attente: "En attente",
  confirmee: "Confirmée",
  annulee: "Annulée",
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
            <th className="text-left px-4 py-3">Téléphone</th>
            <th className="text-left px-4 py-3">Personnes</th>
            <th className="text-left px-4 py-3">Statut</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((r) => (
            <tr key={r.id} className="border-t border-bois/10">
              <td className="px-4 py-3 whitespace-nowrap">
                {r.reservation_date} — {r.reservation_time.slice(0, 5)}
              </td>
              <td className="px-4 py-3">{r.name}</td>
              <td className="px-4 py-3">{r.phone}</td>
              <td className="px-4 py-3">{r.party_size}</td>
              <td className="px-4 py-3">{STATUS_LABELS[r.status]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
