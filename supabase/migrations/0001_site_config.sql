-- Table unique qui stocke toute la configuration du site en JSONB.
-- Une seule ligne (id = 1) — on upsert dessus depuis l'admin.
create table if not exists public.site_config (
  id          int primary key default 1 check (id = 1),
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

-- RLS : lecture publique, écriture réservée aux utilisateurs authentifiés.
alter table public.site_config enable row level security;

create policy "public read" on public.site_config
  for select using (true);

create policy "authenticated write" on public.site_config
  for all using (auth.role() = 'authenticated');

-- Trigger de mise à jour automatique du timestamp.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger site_config_updated_at
  before update on public.site_config
  for each row execute procedure public.set_updated_at();
