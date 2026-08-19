# La Guinguette A&M

Site de commande pour La Guinguette A&M — même esprit que La Paillote de Maël, mais en grande salle avec babyfoot et velux (pas de poolhouse/piscine).

Projet mené avec Maël et Abel.

## Ce que fait le site

- **La Carte** — menu par catégorie, panier, envoi de commande direct en cuisine (aucun compte client requis)
- **Écran Cuisine** — vue Kanban (Nouvelle → En préparation → Prête), accessible via l'icône toque en haut à droite de la Carte

## Stack

- React + Vite
- Supabase (Postgres + REST, projet `guinguette-am` / `mmmaxslemmbcdqmkqhhj`) — appels via l'API REST (`fetch`), clé publique côté client protégée par RLS
- `lucide-react` pour les icônes

## Démarrer en local

```bash
npm install
cp .env.example .env   # clés déjà pré-remplies pour le projet Supabase
npm run dev
```

## Base de données

Le schéma (tables `categories`, `items`, `orders`, `order_items`, policies RLS) est dans
[`supabase/schema.sql`](./supabase/schema.sql), déjà appliqué sur le projet Supabase.

Les articles de la carte proviennent de l'export de la caisse Kash.click. L'item "SERVICE VIP ??"
a volontairement été exclu de l'import.

## Charte graphique

Bordeaux, crème, bois, vert babyfoot, jaune velux — voir le document de charte graphique partagé
avec l'équipe pour le détail des couleurs, typographies et ton éditorial.
