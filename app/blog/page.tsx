import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getPublishedPosts } from "@/lib/data/posts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog — Guinguette A&M",
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <Header />
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-14">
        <h1 className="font-serif font-bold text-4xl text-bois mb-2">Le blog</h1>
        <p className="text-noir/70 mb-10">Des nouvelles de la guinguette.</p>

        {posts.length === 0 && (
          <p className="text-sm text-noir/60">Aucun article pour le moment.</p>
        )}

        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="border border-bois/15 rounded-sm p-5 bg-blanc-casse flex flex-col gap-1.5 hover:border-terracotta transition-colors"
            >
              <span className="text-xs text-noir/50">
                {new Date(post.created_at).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <h2 className="font-serif font-semibold text-xl text-bois">{post.title}</h2>
              {post.excerpt && <p className="text-sm text-noir/70">{post.excerpt}</p>}
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
