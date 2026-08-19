alter table orders add column notes text;

create table reviews (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete set null,
  rating int not null check (rating between 1 and 5),
  customer_name text,
  comment text,
  created_at timestamptz not null default now()
);

alter table reviews enable row level security;

-- can only review an order that's actually been served
create policy "reviews_insert_public" on reviews for insert with check (
  exists (select 1 from orders o where o.id = order_id and o.status = 'servie')
);

create policy "reviews_select_staff" on reviews for select to authenticated using (true);
create policy "reviews_delete_staff" on reviews for delete to authenticated using (true);
