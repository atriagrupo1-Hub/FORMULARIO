// POST /api/closer/enviar — público. Recebe as respostas do candidato a Closer.
import { json, erro, supabase, lerQuestionario, baseSupabase, vaga } from '../../../src/servidor.js';

const LIMITE_CORPO = 400 * 1024;
const LIMITE_TEXTO = 20000;

const texto = (v, limite = LIMITE_TEXTO) => (typeof v === 'string' ? v.slice(0, limite) : '');

/**
 * O endereço do arquivo tem de apontar para o balde deste processo, no projeto
 * configurado. Sem isso qualquer um poderia gravar um link de fora aqui dentro.
 */
function arquivoValido(bruto, env) {
  if (!bruto || typeof bruto !== 'object') return null;
  const url = texto(bruto.url, 600).trim();
  const esperado = `${baseSupabase(env)}/storage/v1/object/public/${vaga('closer').balde}/`;
  if (!url || !esperado || !url.startsWith(esperado)) return null;
  return {
    url,
    nome: texto(bruto.nome, 260),
    tipo: texto(bruto.tipo, 120),
    tamanho: Number.isFinite(bruto.tamanho) ? Math.max(0, Math.round(bruto.tamanho)) : 0,
  };
}

export async function onRequestPost({ request, env }) {
  try {
    const bruto = await request.text();
    if (bruto.length > LIMITE_CORPO) return erro('Envio grande demais.', 413);

    let corpo;
    try {
      corpo = JSON.parse(bruto);
    } catch {
      return erro('Envio inválido.', 400);
    }

    const candidato = texto(corpo.candidato, 120).trim();
    if (!candidato) return erro('Informe o nome do candidato.', 400);

    // Guarda o questionário do momento do envio, para que edições futuras no
    // painel não desalinhem as respostas já recebidas.
    const questionario = await lerQuestionario(env, 'closer');

    const respostas = {};
    const faltando = [];
    for (const pergunta of questionario.perguntas) {
      const r = (corpo.respostas || {})[pergunta.id] || {};
      if (pergunta.tipo === 'upload') {
        const arquivo = arquivoValido(r.arquivo, env);
        respostas[pergunta.id] = { texto: '', arquivo };
        if (pergunta.obrigatoria && !arquivo) faltando.push(pergunta.id);
      } else {
        const conteudo = texto(r.texto);
        respostas[pergunta.id] = { texto: conteudo, arquivo: null };
        if (pergunta.obrigatoria && !conteudo.trim()) faltando.push(pergunta.id);
      }
    }

    // Todas as perguntas são obrigatórias nesta vaga. A tela já cobra, mas o
    // servidor confere de novo — a tela pode ser contornada.
    if (faltando.length) {
      return erro(
        faltando.length === 1
          ? 'Ficou uma pergunta sem resposta.'
          : `Ficaram ${faltando.length} perguntas sem resposta.`,
        400
      );
    }

    const tempos = {};
    for (const pergunta of questionario.perguntas) {
      const ms = (corpo.tempos || {})[pergunta.id];
      tempos[pergunta.id] = Number.isFinite(ms) && ms >= 0 ? Math.round(ms) : 0;
    }

    const agora = new Date();
    const iniciado = Date.parse(corpo.iniciadoEm);
    const iniciadoEm = Number.isFinite(iniciado) ? new Date(iniciado) : agora;
    const tempoTotal = Number.isFinite(corpo.tempoTotalMs)
      ? Math.max(0, Math.round(corpo.tempoTotalMs))
      : agora - iniciadoEm;

    const resposta = await supabase(env, vaga('closer').respostas, {
      method: 'POST',
      headers: { prefer: 'return=representation' },
      body: JSON.stringify({
        candidato,
        whatsapp: texto(corpo.whatsapp, 60).trim(),
        email: texto(corpo.email, 200).trim(),
        iniciado_em: iniciadoEm.toISOString(),
        enviado_em: agora.toISOString(),
        tempo_total_ms: tempoTotal,
        respostas,
        tempos,
        questionario_versao: questionario.versao,
        questionario_snapshot: {
          secoes: questionario.secoes,
          perguntas: questionario.perguntas,
        },
        navegador: texto(request.headers.get('user-agent'), 400),
      }),
    });

    const [gravada] = await resposta.json();
    return json({ ok: true, id: gravada.id });
  } catch (e) {
    return erro(e.message, 500);
  }
}
