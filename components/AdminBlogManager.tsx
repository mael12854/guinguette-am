"use client";

import { useState } from "react";
import { createPost, updatePost, deletePost } from "@/app/admin/actions";
import type { Post } from "@/lib/types";

export function AdminBlogManager({ posts }: { posts: Post[] }) {
  const [showNewForm, setShowNewForm] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      {showNewForm ? (
        <PostForm onCancel={() => setShowNewForm(false)} />
      ) : (
        <button
          onClick={() => setShowNewForm(true)}
          className="self-start text-sm px-4 py-2 rounded-sm bg-terracotta text-blanc-casse hover:opacity-90"
        >
          Nouvel article
        </button>
      )}

      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <PostRow key={post.id} post={post} />
        ))}
        {posts.length === 0 && (
          <p className="text-sm text-noir/60">Aucun article pour le moment.</p>
        )}
      </div>
    </div>
  );
}

function PostRow({ post }: { post: Post }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return <PostForm post={post} onCancel={() => setEditing(false)} />;
  }

  return (
    <div className="border border-bois/15 rounded-sm p-4 bg-blanc-casse flex items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <span className="font-serif font-semibold text-bois">{post.title}</span>
          <span
            className={`text-xs uppercase tracking-wide px-2 py-0.5 rounded-full ${
              post.published ? "bg-vert/15 text-vert" : "bg-bois/10 text-noir/50"
            }`}
          >
            {post.published ? "Publié" : "Brouillon"}
          </span>
        </div>
        <p className="text-xs text-noir/50 mt-0.5">/blog/{post.slug}</p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <button onClick={() => setEditing(true)} className="text-sm text-vert hover:underline">
          Modifier
        </button>
        <button
          onClick={() => {
            if (confirm(`Supprimer "${post.title}" ?`)) deletePost(post.id);
          }}
          className="text-sm text-terracotta hover:underline"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}

function PostForm({ post, onCancel }: { post?: Post; onCancel: () => void }) {
  return (
    <form
      action={post ? updatePost : createPost}
      className="border border-bois/15 rounded-sm p-5 bg-blanc-casse flex flex-col gap-3"
    >
      {post && <input type="hidden" name="id" value={post.id} />}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-wide text-noir/60">Titre</label>
        <input
          name="title"
          defaultValue={post?.title}
          required
          className="border border-bois/20 rounded-sm px-3 py-2 text-sm bg-white"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-wide text-noir/60">
          Résumé (optionnel)
        </label>
        <input
          name="excerpt"
          defaultValue={post?.excerpt ?? ""}
          className="border border-bois/20 rounded-sm px-3 py-2 text-sm bg-white"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-wide text-noir/60">Texte</label>
        <textarea
          name="content"
          defaultValue={post?.content}
          required
          rows={8}
          className="border border-bois/20 rounded-sm px-3 py-2 text-sm bg-white resize-y"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-noir/80">
        <input type="checkbox" name="published" defaultChecked={post?.published ?? false} />
        Publié (visible sur /blog)
      </label>
      <div className="flex gap-3">
        <button
          type="submit"
          className="text-sm px-4 py-2 rounded-sm bg-terracotta text-blanc-casse hover:opacity-90"
        >
          {post ? "Enregistrer" : "Créer l'article"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm px-4 py-2 rounded-sm border border-bois/25 text-bois hover:bg-bois/5"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
