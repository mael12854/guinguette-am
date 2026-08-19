@AGENTS.md

# Guinguette A&M — project memory

Website for Abel & Maël's guinguette, built from the Claude Design brand-guidelines
handoff bundle one level up (`../README.md`, `../chats/`,
`../project/Guinguette A&M - Brand Guidelines.dc.html`). This `site/` directory is
its own git repo, pushed to GitHub `mael12854/guinguette-am`.

## Stack

- Next.js 16 (App Router, TypeScript, Turbopack) — see `AGENTS.md` above for
  Next.js-16-specific breaking changes (e.g. `middleware.ts` → `proxy.ts`).
- Supabase (Postgres + Auth + Realtime). Project id: `mmmaxslemmbcdqmkqhhj`.
- Tailwind CSS v4 with brand OKLCH tokens (bois, terracotta, vert, creme, velux,
  blanc-casse, noir) defined in `app/globals.css`.
- Fonts: Fraunces (headings/logo) + Poppins (body), via `next/font/google`.
- Deployed on Vercel, auto-deploy from GitHub `mael12854/guinguette-am` `main`.

## Brand/content decisions (don't reintroduce old versions)

- Friendship length is **trois ans** (not ten).
- Address is just **28bis avenue de la République, Igny** — no building name.
  Explicitly rejected: "Maison Artoré", "chez Dominique et Dominique Artoré".
  Footer only says "chez les grands-parents de Maël".
- Footer includes a "Les Studios A&M" section linking to
  `https://beta-les-studios-aetm.netlify.app` (Abel & Maël's other project, a
  film/theatre collective with Maya and Martin) and a "Lire le blog →" link.
- Dark/night mode was explored once (published as a one-off Artifact preview) and
  explicitly rejected — stay on the day/light design.
- No stock photos — if/when photos are added, use the owners' own photos of the
  actual place (this was discussed, not yet done).
- Commits are authored as `Claude <noreply@anthropic.com>` (user's explicit
  preference — never use the user's own name/email for commits here).

## Features implemented

- `/` — landing page.
- `/carte` — browse menu (categories + flavor/variant options via
  `menu_item_options`), cart, kitchen-note textarea, submits an order.
- `/reservation` — reservation form.
- `/suivi` — client-side multi-order tracking via `localStorage`
  (`lib/my-orders.ts`), realtime status updates, star-rating review form once an
  order is `servie`. Nav shows a "Vos commandes en cours" link that auto-hides
  when there are none.
- `/cuisine` — staff kitchen board, advance order status, shows kitchen notes.
- `/admin` — staff: menu CRUD, reservations list, reviews list, blog post CRUD.
- `/avis` — public reviews page.
- `/blog` + `/blog/[slug]` — public blog, admin-authored via `/admin`.
- `/connexion` — shared staff login (Supabase Auth), guards `/cuisine` and
  `/admin` via `proxy.ts`.
- Orders auto-delete 5 minutes after being marked `servie` (`pg_cron` job).
- Reviews survive order deletion (`order_id` is `ON DELETE SET NULL`).

## Known gaps / ideas not yet done

- No real photos anywhere on the site yet.
- No Open Graph tags (link previews on WhatsApp/Instagram/etc. will be blank).
- Staff password was given directly to the user as a value to set as the
  Supabase Auth user's password — it is **not** stored anywhere in this repo.

## Git push workflow (important, don't skip)

Global git config in this environment rewrites `https://github.com/` to a local
proxy (`url.http://local_proxy@127.0.0.1:.../git/.insteadof`) that returns 403 for
pushes. Working pattern used successfully:

1. `git config --global --unset url."http://local_proxy@127.0.0.1:<port>/git/".insteadof`
2. `git remote set-url origin https://github.com/mael12854/guinguette-am.git`
3. Push with the token in a one-off header (never write it to disk/config):
   `git -c credential.helper= -c http.extraHeader="Authorization: Basic $(printf 'x-access-token:<TOKEN>' | base64 -w0)" push origin main`
4. Restore the proxy rewrite and remote URL afterwards so the repo is left in its
   normal state:
   `git config --global url."http://local_proxy@127.0.0.1:<port>/git/".insteadof "https://github.com/"`
   `git remote set-url origin http://local_proxy@127.0.0.1:<port>/git/mael12854/guinguette-am.git`

The user has chosen to keep reusing the same GitHub PAT rather than regenerate one
per session (their explicit call, aware it stays live). Ask them for it when a push
is needed and it's not already in the current session's context.

## Supabase migrations

Applied via `mcp__Supabase__apply_migration`, files kept in
`supabase/migrations/` for history (0001 init through 0008 blog). If that MCP
server is disconnected, wait for it to reconnect (`ToolSearch` will surface it
again) rather than guessing at schema state.
