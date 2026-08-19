# La Guinguette A&M

Site de la Guinguette A&M — grande salle, poutres en bois, verrière, babyfoot.
Next.js (App Router) + Supabase (Postgres, Auth, Realtime).

## Fonctionnalités

- `/` — page d'accueil (identité de marque : logo, couleurs, typographie)
- `/carte` — menu, choix des goûts/options, panier, commande
- `/reservation` — formulaire de réservation
- `/suivi/[orderId]` — suivi de commande en temps réel
- `/cuisine` — écran cuisine (protégé) : changer le statut des commandes
- `/admin` — administration (protégé) : gestion de la carte + réservations
- `/connexion` — connexion équipe (Supabase Auth), partagée par `/cuisine` et `/admin`

## Développement

```bash
npm install
cp .env.local.example .env.local   # renseigner les valeurs Supabase
npm run dev
```

Variables d'environnement (`.env.local`) :

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

## Base de données

Le schéma (`menu_items`, `menu_item_options`, `reservations`, `orders`,
`order_items`, RLS, realtime) vit dans `supabase/migrations/`. Il est déjà
appliqué sur le projet Supabase du repo ; ces fichiers servent de référence /
pour rejouer le schéma sur un autre projet.

## Compte équipe (cuisine / admin)

`/cuisine` et `/admin` sont protégés par une session Supabase Auth. Créer le
compte équipe directement dans le dashboard Supabase (**Authentication → Add
user**) — le mot de passe n'est jamais stocké dans ce dépôt.
