import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MenuBrowser } from "@/components/MenuBrowser";
import { getAvailableMenu } from "@/lib/data/menu";

export const dynamic = "force-dynamic";

export default async function CartePage() {
  const items = await getAvailableMenu();

  return (
    <>
      <Header />
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-14">
        <h1 className="font-serif font-bold text-4xl text-bois mb-2">La carte</h1>
        <p className="text-noir/70 mb-10">
          Composez votre commande, choisissez vos goûts, et suivez sa préparation en
          direct.
        </p>
        <MenuBrowser items={items} />
      </main>
      <Footer />
    </>
  );
}
