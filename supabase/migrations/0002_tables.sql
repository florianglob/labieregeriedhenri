-- Tables opérationnelles La Bièregerie d'Henri
-- À exécuter dans Supabase SQL Editor

-- Bières
create table if not exists public.beers (
  id          bigserial primary key,
  nom         text not null,
  brasserie   text not null,
  style       text not null,
  style_label text,
  origine     text,
  deg         text,
  format      text,
  coup        boolean default false,
  note        text,
  prix        jsonb default '{}'::jsonb,
  photo       text,
  details     jsonb default '{}'::jsonb,
  actif       boolean default true,
  position    int default 0,
  updated_at  timestamptz default now()
);
alter table public.beers enable row level security;
create policy "beers public read"  on public.beers for select using (true);
create policy "beers auth write"   on public.beers for all    using (auth.role() = 'authenticated');

-- Événements
create table if not exists public.evenements (
  id          bigserial primary key,
  titre       text not null,
  tag         text,
  date_event  date not null,
  heure       text,
  description text,
  photo       text,
  actif       boolean default true,
  created_at  timestamptz default now()
);
alter table public.evenements enable row level security;
create policy "evenements public read" on public.evenements for select using (true);
create policy "evenements auth write" on public.evenements for all    using (auth.role() = 'authenticated');

-- Menu de la semaine (une seule ligne actif = true)
create table if not exists public.menu_semaine (
  id              bigserial primary key,
  semaine         text,
  entrees         jsonb default '[]'::jsonb,
  plats           jsonb default '[]'::jsonb,
  desserts        jsonb default '[]'::jsonb,
  dessert_du_jour jsonb default '{}'::jsonb,
  formules        jsonb default '[]'::jsonb,
  accord          jsonb default '{}'::jsonb,
  actif           boolean default true,
  updated_at      timestamptz default now()
);
alter table public.menu_semaine enable row level security;
create policy "menu public read" on public.menu_semaine for select using (true);
create policy "menu auth write" on public.menu_semaine for all    using (auth.role() = 'authenticated');

-- Horaires
create table if not exists public.horaires (
  id       bigserial primary key,
  jour     text not null,
  heure    text,
  ferme    boolean default false,
  position int
);
alter table public.horaires enable row level security;
create policy "horaires public read" on public.horaires for select using (true);
create policy "horaires auth write" on public.horaires for all    using (auth.role() = 'authenticated');

-- Forfaits tireuse
create table if not exists public.forfaits (
  id          text primary key,
  nom         text not null,
  kicker      text,
  base        text,
  description text,
  inclus      text[] default '{}'::text[],
  featured    boolean default false,
  addon       text,
  position    int default 0
);
alter table public.forfaits enable row level security;
create policy "forfaits public read" on public.forfaits for select using (true);
create policy "forfaits auth write" on public.forfaits for all    using (auth.role() = 'authenticated');

-- Fûts disponibles
create table if not exists public.futs (
  id        bigserial primary key,
  nom       text not null,
  style     text,
  brasserie text,
  volume    text,
  prix      text,
  actif     boolean default true
);
alter table public.futs enable row level security;
create policy "futs public read" on public.futs for select using (true);
create policy "futs auth write" on public.futs for all    using (auth.role() = 'authenticated');

-- Boissons (vins, softs, cocktails, spiritueux)
create table if not exists public.boissons (
  id          bigserial primary key,
  nom         text not null,
  categorie   text,
  description text,
  origine     text,
  prix        jsonb default '{}'::jsonb,
  actif       boolean default true,
  position    int default 0
);
alter table public.boissons enable row level security;
create policy "boissons public read" on public.boissons for select using (true);
create policy "boissons auth write" on public.boissons for all    using (auth.role() = 'authenticated');
