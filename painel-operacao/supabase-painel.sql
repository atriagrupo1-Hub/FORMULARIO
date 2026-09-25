-- Painel da Operação · Atria Group
-- Cole tudo isto em Supabase › SQL Editor › New query e clique em RUN.

create table if not exists public.painel (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.painel_segredos (
  id text primary key,
  data jsonb not null default '{}'::jsonb
);

alter table public.painel enable row level security;
alter table public.painel_segredos enable row level security;

-- Qualquer pessoa com o link pode LER o painel (sem senhas)
drop policy if exists "painel leitura publica" on public.painel;
create policy "painel leitura publica" on public.painel for select using (true);

-- Só quem está logado pode ESCREVER
drop policy if exists "painel editores inserem" on public.painel;
create policy "painel editores inserem" on public.painel for insert to authenticated with check (true);
drop policy if exists "painel editores atualizam" on public.painel;
create policy "painel editores atualizam" on public.painel for update to authenticated using (true) with check (true);

-- Senhas: só quem está logado lê e escreve
drop policy if exists "segredos leitura logados" on public.painel_segredos;
create policy "segredos leitura logados" on public.painel_segredos for select to authenticated using (true);
drop policy if exists "segredos editores inserem" on public.painel_segredos;
create policy "segredos editores inserem" on public.painel_segredos for insert to authenticated with check (true);
drop policy if exists "segredos editores atualizam" on public.painel_segredos;
create policy "segredos editores atualizam" on public.painel_segredos for update to authenticated using (true) with check (true);

-- Atualização em tempo real para quem está só vendo
alter publication supabase_realtime add table public.painel;
