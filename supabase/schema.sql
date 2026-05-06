create extension if not exists "pgcrypto";

create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text default '',
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  sector text not null,
  description text not null,
  result text default '',
  image_url text default '',
  services text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

create index if not exists brands_created_at_idx on public.brands (created_at desc);
create index if not exists projects_created_at_idx on public.projects (created_at desc);

alter table public.brands enable row level security;
alter table public.projects enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "Public can read brands" on public.brands;
create policy "Public can read brands"
  on public.brands
  for select
  using (true);

drop policy if exists "Authenticated admins can insert brands" on public.brands;
create policy "Authenticated admins can insert brands"
  on public.brands
  for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Authenticated admins can update brands" on public.brands;
create policy "Authenticated admins can update brands"
  on public.brands
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Authenticated admins can delete brands" on public.brands;
create policy "Authenticated admins can delete brands"
  on public.brands
  for delete
  to authenticated
  using (public.is_admin());

drop policy if exists "Public can read projects" on public.projects;
create policy "Public can read projects"
  on public.projects
  for select
  using (true);

drop policy if exists "Authenticated admins can insert projects" on public.projects;
create policy "Authenticated admins can insert projects"
  on public.projects
  for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Authenticated admins can update projects" on public.projects;
create policy "Authenticated admins can update projects"
  on public.projects
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Authenticated admins can delete projects" on public.projects;
create policy "Authenticated admins can delete projects"
  on public.projects
  for delete
  to authenticated
  using (public.is_admin());

insert into storage.buckets (id, name, public)
values
  ('logos', 'logos', true),
  ('projects', 'projects', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public can read portfolio images" on storage.objects;
create policy "Public can read portfolio images"
  on storage.objects
  for select
  using (bucket_id in ('logos', 'projects'));

drop policy if exists "Authenticated admins can upload portfolio images" on storage.objects;
create policy "Authenticated admins can upload portfolio images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id in ('logos', 'projects') and public.is_admin());

drop policy if exists "Authenticated admins can update portfolio images" on storage.objects;
create policy "Authenticated admins can update portfolio images"
  on storage.objects
  for update
  to authenticated
  using (bucket_id in ('logos', 'projects') and public.is_admin())
  with check (bucket_id in ('logos', 'projects') and public.is_admin());

drop policy if exists "Authenticated admins can delete portfolio images" on storage.objects;
create policy "Authenticated admins can delete portfolio images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id in ('logos', 'projects') and public.is_admin());
