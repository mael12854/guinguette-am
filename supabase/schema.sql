-- Schéma de la base "guinguette-am" (Supabase)
-- Appliqué directement sur le projet mmmaxslemmbcdqmkqhhj.
-- Conservé ici à titre de référence / pour recréer l'environnement si besoin.

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create table public.items (
  id uuid primary key default gen_random_uuid(),
  plu bigint unique, -- identifiant d'origine de la caisse (colonne "#")
  name text not null,
  description text,
  price numeric(10,2) not null default 0,
  category_id uuid references public.categories(id),
  tva text,
  position int not null default 0,
  image_url text,
  active boolean not null default true, -- false = retiré sans supprimer l'historique
  created_at timestamptz not null default now()
);

create index items_category_id_idx on public.items(category_id);
create index items_active_idx on public.items(active);

create type public.order_status as enum ('nouvelle', 'en_preparation', 'prete', 'servie', 'annulee');

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  table_label text,
  status public.order_status not null default 'nouvelle',
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  item_id uuid references public.items(id),
  item_name_snapshot text not null,
  unit_price_snapshot numeric(10,2) not null,
  quantity int not null default 1,
  note text,
  created_at timestamptz not null default now()
);

create index order_items_order_id_idx on public.order_items(order_id);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

alter table public.categories enable row level security;
alter table public.items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "Categories are publicly readable" on public.categories for select using (true);
create policy "Items are publicly readable" on public.items for select using (true);
create policy "Anyone can create an order" on public.orders for insert with check (true);
create policy "Anyone can read orders" on public.orders for select using (true);
create policy "Anyone can update order status" on public.orders for update using (true);
create policy "Anyone can create order items" on public.order_items for insert with check (true);
create policy "Anyone can read order items" on public.order_items for select using (true);
