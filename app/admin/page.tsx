import { AdminMenuManager } from "@/components/AdminMenuManager";
import { ReservationsTable } from "@/components/ReservationsTable";
import { getAllMenuItems, getReservations } from "@/lib/data/admin";
import { logout } from "@/app/connexion/actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [items, reservations] = await Promise.all([getAllMenuItems(), getReservations()]);

  return (
    <>
      <header className="bg-bois px-6 py-3.5 flex items-center justify-between">
        <span className="font-serif font-bold text-lg text-blanc-casse">
          Administration
        </span>
        <form action={logout}>
          <button className="text-sm text-[oklch(0.85_0.02_70)] hover:text-blanc-casse">
            Déconnexion
          </button>
        </form>
      </header>
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10 flex flex-col gap-14">
        <section>
          <h1 className="font-serif font-bold text-3xl text-bois mb-6">La carte</h1>
          <AdminMenuManager items={items} />
        </section>
        <section>
          <h2 className="font-serif font-bold text-3xl text-bois mb-6">Réservations</h2>
          <ReservationsTable reservations={reservations} />
        </section>
      </main>
    </>
  );
}
