import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LoginForm } from "@/components/LoginForm";

export default async function ConnexionPage(props: PageProps<"/connexion">) {
  const searchParams = await props.searchParams;
  const next = typeof searchParams.next === "string" ? searchParams.next : "/admin";

  return (
    <>
      <Header />
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-14">
        <h1 className="font-serif font-bold text-4xl text-bois mb-2">Espace équipe</h1>
        <p className="text-noir/70 mb-10">Connexion cuisine &amp; administration.</p>
        <LoginForm next={next} />
      </main>
      <Footer />
    </>
  );
}
