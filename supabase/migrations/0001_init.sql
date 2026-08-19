-- Guinguette A&M — core schema
create extension if not exists "pgcrypto";

create table menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null,
  category text not null check (category in ('entree','plat','dessert','boisson')),
  image_url text,
  is_available boolean not null default true,
  created_at timestamptz not null default now()
);

create table menu_item_options (
  id uuid primary key default gen_random_uuid(),
  menu_item_id uuid not null references menu_items(id) on delete cascade,
  label text not null,
  extra_price numeric(10,2) not null default 0,
  sort_order int not null default 0
);
create index on menu_item_options (menu_item_id);

create table reservations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  party_size int not null check (party_size > 0),
  reservation_date date not null,
  reservation_time time not null,
  status text not null default 'en_attente' check (status in ('en_attente','confirmee','annulee')),
  notes text,
  created_at timestamptz not null default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  table_label text,
  status text not null default 'nouvelle' check (status in ('nouvelle','en_preparation','prete','servie','annulee')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  menu_item_id uuid not null references menu_items(id),
  option_id uuid references menu_item_options(id),
  quantity int not null default 1 check (quantity > 0),
  unit_price numeric(10,2) not null,
  notes text
);
create index on order_items (order_id);

-- keep orders.updated_at fresh on status changes
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger orders_set_updated_at
before update on orders
for each row execute function set_updated_at();

-- Row Level Security
alter table menu_items enable row level security;
alter table menu_item_options enable row level security;
alter table reservations enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- menu: anyone can read, only signed-in staff can write
create policy "menu_items_select_public" on menu_items for select using (true);
create policy "menu_items_write_staff" on menu_items for all to authenticated using (true) with check (true);

create policy "menu_item_options_select_public" on menu_item_options for select using (true);
create policy "menu_item_options_write_staff" on menu_item_options for all to authenticated using (true) with check (true);

-- reservations: anyone can create, only staff can read/manage
create policy "reservations_insert_public" on reservations for insert with check (true);
create policy "reservations_select_staff" on reservations for select to authenticated using (true);
create policy "reservations_update_staff" on reservations for update to authenticated using (true) with check (true);

-- orders/order_items: anyone can place an order and read it back by id
-- (the id is an unguessable uuid, used as the /suivi/[orderId] tracking link);
-- only staff can change status.
create policy "orders_insert_public" on orders for insert with check (true);
create policy "orders_select_public" on orders for select using (true);
create policy "orders_update_staff" on orders for update to authenticated using (true) with check (true);

create policy "order_items_insert_public" on order_items for insert with check (true);
create policy "order_items_select_public" on order_items for select using (true);
create policy "order_items_update_staff" on order_items for update to authenticated using (true) with check (true);

-- realtime for live order tracking + kitchen display
alter publication supabase_realtime add table orders;
alter publication supabase_realtime add table order_items;
