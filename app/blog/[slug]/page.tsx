import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getPublishedPostBySlug } from "@/lib/data/posts";

export const dynamic = "force-dynamic";

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) notFound();

  return (
    <>
      <Header />
      <main className="flex-1 max-w-2xl w-full mx-auto px-6 py-14">
        <Link href="/blog" className="text-sm text-terracotta hover:underline">
          ← Le blog
        </Link>
        <span className="block text-xs text-noir/50 mt-6">
          {new Date(post.created_at).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
        <h1 className="font-serif font-bold text-4xl text-bois mt-2 mb-8">{post.title}</h1>
        <div className="flex flex-col gap-4 text-noir/80 leading-relaxed">
          {post.content
            .split(/\n\s*\n/)
            .filter((p) => p.trim())
            .map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
