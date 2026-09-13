-- ATRIA — estrutura do banco. Cole isto uma única vez no SQL Editor do Supabase.
-- Pode rodar de novo sem problema: nada é apagado.

-- 1) Questionário. Cada edição feita no painel grava uma versão nova,
--    então o histórico fica preservado.
create table if not exists public.atria_questionario (
  id        bigint generated always as identity primary key,
  versao    integer      not null unique,
  dados     jsonb        not null,
  criado_em timestamptz  not null default now()
);

-- 2) Respostas das candidatas.
create table if not exists public.atria_respostas (
  id                    uuid        primary key default gen_random_uuid(),
  candidata             text        not null,
  iniciado_em           timestamptz,
  enviado_em            timestamptz not null default now(),
  tempo_total_ms        bigint,
  respostas             jsonb       not null default '{}'::jsonb,
  tempos                jsonb       not null default '{}'::jsonb,
  questionario_versao   integer,
  questionario_snapshot jsonb,
  navegador             text
);

create index if not exists atria_respostas_enviado_em_idx
  on public.atria_respostas (enviado_em desc);

-- 3) Trancas de segurança.
--    Com RLS ligado e nenhuma política de liberação, ninguém acessa estas
--    tabelas pelo navegador. Só a chave service_role (que fica guardada no
--    Cloudflare, no servidor) consegue ler e gravar.
alter table public.atria_questionario enable row level security;
alter table public.atria_respostas    enable row level security;

revoke all on public.atria_questionario from anon, authenticated;
revoke all on public.atria_respostas    from anon, authenticated;
