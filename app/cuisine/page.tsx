import { KitchenBoard } from "@/components/KitchenBoard";
import { getActiveOrders } from "@/lib/data/orders";
import { logout } from "@/app/connexion/actions";

export const dynamic = "force-dynamic";

export default async function CuisinePage() {
  const orders = await getActiveOrders();

  return (
    <>
      <header className="bg-bois px-6 py-3.5 flex items-center justify-between">
        <span className="font-serif font-bold text-lg text-blanc-casse">
          Écran cuisine
        </span>
        <form action={logout}>
          <button className="text-sm text-[oklch(0.85_0.02_70)] hover:text-blanc-casse">
            Déconnexion
          </button>
        </form>
      </header>
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10">
        <KitchenBoard orders={orders} />
      </main>
    </>
  );
}
