// Utilidades compartilhadas pelas funções de servidor (Cloudflare Pages Functions).
// A chave service_role do Supabase só existe aqui, no servidor. O navegador da
// candidata nunca a recebe.

import { QUESTIONARIO_PADRAO } from './questionario-padrao.js';
import { CLOSER_PADRAO } from './closer-padrao.js';

// Cada vaga tem suas próprias tabelas, para que as respostas de um processo
// nunca se misturem com as de outro.
export const VAGAS = {
  atria: {
    questionario: 'atria_questionario',
    respostas: 'atria_respostas',
    padrao: QUESTIONARIO_PADRAO,
    balde: '',
  },
  closer: {
    questionario: 'closer_questionario',
    respostas: 'closer_respostas',
    padrao: CLOSER_PADRAO,
    balde: 'closer-envios',
  },
};

export function vaga(nome) {
  return VAGAS[nome] || VAGAS.atria;
}

// Mantidos para as funções da vaga original, que vieram antes das demais.
export const TABELA_QUESTIONARIO = VAGAS.atria.questionario;
export const TABELA_RESPOSTAS = VAGAS.atria.respostas;

export function json(dados, status = 200) {
  return new Response(JSON.stringify(dados), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

export function erro(mensagem, status = 400) {
  return json({ erro: mensagem }, status);
}

/** Chama a API REST do Supabase com a chave privilegiada. */
export async function supabase(env, caminho, init = {}) {
  // Aceita a URL do projeto com ou sem o sufixo /rest/v1, que é fácil de
  // copiar junto do painel do Supabase.
  const base = (env.SUPABASE_URL || '')
    .trim()
    .replace(/\/+$/, '')
    .replace(/\/rest\/v1$/, '');
  const chave = env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!base || !chave) {
    throw new Error(
      'Faltam as variáveis SUPABASE_URL e/ou SUPABASE_SERVICE_ROLE_KEY no Cloudflare.'
    );
  }
  const resposta = await fetch(`${base}/rest/v1/${caminho}`, {
    ...init,
    headers: {
      apikey: chave,
      authorization: `Bearer ${chave}`,
      'content-type': 'application/json',
      ...(init.headers || {}),
    },
  });
  if (!resposta.ok) {
    const corpo = await resposta.text();
    throw new Error(`Supabase respondeu ${resposta.status}: ${corpo.slice(0, 300)}`);
  }
  return resposta;
}

/** Comparação de tempo constante, para a chave do painel não vazar por timing. */
function iguais(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diferenca = 0;
  for (let i = 0; i < a.length; i++) diferenca |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diferenca === 0;
}

/**
 * Confere a chave do painel. Ela chega pelo cabeçalho x-atria-chave ou pela
 * query ?k=. Devolve null quando está tudo certo, ou uma Response de recusa.
 */
export function exigirChave(request, env) {
  const esperada = env.ADMIN_KEY || '';
  if (!esperada) {
    return erro('A variável ADMIN_KEY ainda não foi configurada no Cloudflare.', 500);
  }
  const url = new URL(request.url);
  const recebida = request.headers.get('x-atria-chave') || url.searchParams.get('k') || '';
  if (!iguais(recebida, esperada)) return erro('Chave do painel inválida.', 401);
  return null;
}

/** Lê a versão mais recente do questionário; cai no padrão se o banco estiver vazio. */
export async function lerQuestionario(env, nomeVaga = 'atria') {
  const v = vaga(nomeVaga);
  const resposta = await supabase(
    env,
    `${v.questionario}?select=versao,dados&order=versao.desc&limit=1`
  );
  const linhas = await resposta.json();
  if (!linhas.length) return { ...v.padrao, versao: 0, padrao: true };
  return { ...linhas[0].dados, versao: linhas[0].versao, padrao: false };
}

/** Endereço base do projeto no Supabase, sem o sufixo /rest/v1. */
export function baseSupabase(env) {
  return (env.SUPABASE_URL || '').trim().replace(/\/+$/, '').replace(/\/rest\/v1$/, '');
}

/**
 * Pede ao Supabase uma URL assinada para o navegador enviar um arquivo
 * direto ao Storage. O arquivo não passa pelo Cloudflare: assim um vídeo de
 * cinco minutos não esbarra no limite de corpo das funções.
 */
export async function assinarEnvio(env, balde, caminho) {
  const base = baseSupabase(env);
  const chave = env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!base || !chave) {
    throw new Error('Faltam as variáveis SUPABASE_URL e/ou SUPABASE_SERVICE_ROLE_KEY no Cloudflare.');
  }
  const r = await fetch(
    `${base}/storage/v1/object/upload/sign/${balde}/${caminho}`,
    {
      method: 'POST',
      headers: {
        apikey: chave,
        authorization: `Bearer ${chave}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ expiresIn: 3600 }),
    }
  );
  if (!r.ok) {
    const corpo = await r.text();
    throw new Error(`Supabase Storage respondeu ${r.status}: ${corpo.slice(0, 300)}`);
  }
  const { url } = await r.json();
  return {
    envio: `${base}/storage/v1${url}`,
    publico: `${base}/storage/v1/object/public/${balde}/${caminho}`,
  };
}
