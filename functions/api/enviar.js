// POST /api/enviar — público. Recebe as respostas da candidata.
import {
  json, erro, supabase, lerQuestionario, TABELA_RESPOSTAS,
} from '../../src/servidor.js';

const LIMITE_CORPO = 400 * 1024; // 400 KB é folgado para 35 respostas de texto
const LIMITE_TEXTO = 20000;

const texto = (v, limite = LIMITE_TEXTO) =>
  typeof v === 'string' ? v.slice(0, limite) : '';

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

    const candidata = texto(corpo.candidata, 120).trim();
    if (!candidata) return erro('Informe o nome da candidata.', 400);

    // Guarda o questionário do momento do envio, para que edições futuras
    // no painel não desalinhem as respostas já recebidas.
    const questionario = await lerQuestionario(env);

    const respostas = {};
    for (const pergunta of questionario.perguntas) {
      const r = (corpo.respostas || {})[pergunta.id] || {};
      respostas[pergunta.id] = {
        texto: texto(r.texto),
        escolha: texto(r.escolha, 8),
        nota: Number.isInteger(r.nota) && r.nota >= 0 && r.nota <= 10 ? r.nota : null,
        ordem: Array.isArray(r.ordem) ? r.ordem.slice(0, 40).map((i) => texto(i, 400)) : [],
      };
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

    const resposta = await supabase(env, TABELA_RESPOSTAS, {
      method: 'POST',
      headers: { prefer: 'return=representation' },
      body: JSON.stringify({
        candidata,
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
