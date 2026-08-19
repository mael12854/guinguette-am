create table posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger posts_set_updated_at
before update on posts
for each row execute function set_updated_at();

alter table posts enable row level security;

create policy "posts_select_published_public" on posts for select using (published = true);
create policy "posts_select_staff" on posts for select to authenticated using (true);
create policy "posts_write_staff" on posts for all to authenticated using (true) with check (true);
