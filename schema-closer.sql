-- ATRIA — vaga de Closer. Cole isto uma única vez no SQL Editor do Supabase.
-- Pode rodar de novo sem problema: nada é apagado e nada da vaga anterior é tocado.
-- As tabelas atria_* continuam exatamente como estão.

-- 1) Questionário do Closer. Cada edição no painel grava uma versão nova.
create table if not exists public.closer_questionario (
  id        bigint generated always as identity primary key,
  versao    integer      not null unique,
  dados     jsonb        not null,
  criado_em timestamptz  not null default now()
);

-- 2) Respostas dos candidatos a Closer.
create table if not exists public.closer_respostas (
  id                    uuid        primary key default gen_random_uuid(),
  candidato             text        not null,
  whatsapp              text,
  email                 text,
  iniciado_em           timestamptz,
  enviado_em            timestamptz not null default now(),
  tempo_total_ms        bigint,
  respostas             jsonb       not null default '{}'::jsonb,
  tempos                jsonb       not null default '{}'::jsonb,
  questionario_versao   integer,
  questionario_snapshot jsonb,
  navegador             text
);

create index if not exists closer_respostas_enviado_em_idx
  on public.closer_respostas (enviado_em desc);

-- 3) Trancas de segurança: RLS ligado e nenhuma política de liberação.
--    Ninguém alcança estas tabelas pelo navegador. Só a chave service_role,
--    que fica guardada no Cloudflare.
alter table public.closer_questionario enable row level security;
alter table public.closer_respostas    enable row level security;

revoke all on public.closer_questionario from anon, authenticated;
revoke all on public.closer_respostas    from anon, authenticated;

-- 4) Onde ficam os áudios e vídeos do teste prático (pergunta 17).
--    Balde público: quem tiver o endereço do arquivo consegue ouvir, sem login.
--    O endereço só aparece no painel, e o nome do arquivo é sorteado.
insert into storage.buckets (id, name, public, file_size_limit)
values ('closer-envios', 'closer-envios', true, 524288000)
on conflict (id) do update
  set public = true,
      file_size_limit = 524288000;

-- O envio é feito com URL assinada pelo servidor (service_role), então o
-- navegador do candidato não precisa de nenhuma permissão de escrita aqui.
-- A leitura é pública porque o balde é público.
