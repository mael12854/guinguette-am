@AGENTS.md

# Guinguette A&M — project memory

Website for Abel & Maël's guinguette, built from the Claude Design brand-guidelines
handoff bundle. The original brand guidelines file is checked into this repo at
`docs/brand-guidelines/Guinguette A&M - Brand Guidelines.dc.html` (colors, type,
logo lockups — see "Stack" below for how those values were applied). This `site/`
directory is its own git repo, pushed to GitHub `mael12854/guinguette-am`.

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
- No stock photos. As of the homepage's "Où nous trouver" section, real imagery
  of the actual address is a Google Maps Street View embed + a map embed (both
  `<iframe src="https://www.google.com/maps/embed?pb=...">`, generated via
  Maps' own Share → Embed a map, pointed at 28bis avenue de la République,
  Igny) — not owner-uploaded photos yet. If real photos from Abel & Maël show
  up later, they can replace or sit alongside these embeds.
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

- No real owner photos yet — homepage currently shows the address via Google
  Maps Street View + map embeds (see brand/content decisions above), not
  photos Abel & Maël took themselves.
- Open Graph / Twitter Card tags are done (`app/opengraph-image.tsx`,
  `app/twitter-image.tsx` — generated brand image, not a photo).
- Staff password was given directly to the user as a value to set as the
  Supabase Auth user's password — it is **not** stored anywhere in this repo.

## Git push workflow (important, don't skip)

Global git config in this environment rewrites `https://github.com/` to a local
proxy (`url.http://local_proxy@127.0.0.1:.../git/.insteadof`) that returns 403 for
pushes. Simplest fix: call `add_repo` (owner `mael12854`, repo `guinguette-am`,
access `push`) — it attaches the repo with working push credentials and
reconfigures `origin` to the plain GitHub URL, no token/env juggling needed.
`git push` then just works. (Fallback if `add_repo` isn't available: push with
a token in a one-off `-c http.extraHeader="Authorization: Basic ..."`, never
written to disk — the user has chosen to keep reusing the same GitHub PAT
rather than regenerate one per session, their explicit call.)

**Push straight to `main`, every time, without asking first or waiting for a
PR.** The user explicitly said re-asking each time is friction they don't
want. Develop on `claude/guinguette-am-dev-bp20gc` as usual, then merge it
into `main` and push — `git merge --ff-only` when possible, a normal
`git merge` (creates a merge commit) when `main` has diverged (e.g. after a
PR was merged separately) since `--ff-only` will refuse in that case. If a PR
against this branch already exists when you're about to push, merging it via
`mcp__github__merge_pull_request` is fine too — either path is expected to
land on `main` without a confirmation round-trip.

## Supabase migrations

Applied via `mcp__Supabase__apply_migration`, files kept in
`supabase/migrations/` for history (0001 init through 0008 blog). If that MCP
server is disconnected, wait for it to reconnect (`ToolSearch` will surface it
again) rather than guessing at schema state.
