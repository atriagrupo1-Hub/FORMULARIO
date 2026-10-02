// /api/closer/admin/questionario — aba "Perguntas" do painel do Closer. Exige a chave.
import {
  json, erro, supabase, exigirChave, lerQuestionario, vaga,
} from '../../../../src/servidor.js';

const TIPOS = ['texto', 'escolha', 'ordem', 'escala', 'upload'];
const txt = (v, limite = 4000) => (typeof v === 'string' ? v.slice(0, limite).trim() : '');
const lista = (v, limite = 60) => (Array.isArray(v) ? v.slice(0, limite) : []);

/** Normaliza e valida o que o painel mandou, para o banco nunca receber lixo. */
function validar(dados) {
  const secoes = lista(dados?.secoes, 40)
    .map((s) => ({
      id: txt(s.id, 40),
      titulo: txt(s.titulo, 300),
      nota: lista(s.nota, 20).map((l) => txt(l, 1200)).filter(Boolean),
    }))
    .filter((s) => s.id && s.titulo);

  if (!secoes.length) throw new Error('É preciso ter pelo menos uma seção.');

  const idsSecoes = new Set(secoes.map((s) => s.id));
  if (idsSecoes.size !== secoes.length) throw new Error('Há seções com o mesmo identificador.');

  const perguntas = lista(dados?.perguntas, 200)
    .map((p) => {
      const tipo = TIPOS.includes(p.tipo) ? p.tipo : 'texto';
      return {
        id: txt(p.id, 40),
        secao: txt(p.secao, 40),
        tipo,
        obrigatoria: true, // nesta vaga nenhuma pergunta pode ficar em branco
        linhas: Number.isFinite(p.linhas) ? Math.min(20, Math.max(1, Math.round(p.linhas))) : 4,
        titulo: txt(p.titulo, 1200),
        tituloNoTopo: p.tituloNoTopo === true,
        destaque: p.destaque === true,
        ajuda: lista(p.ajuda, 20).map((l) => txt(l, 1200)).filter(Boolean),
        cenario: lista(p.cenario, 20).map((l) => txt(l, 1200)).filter(Boolean),
        cenarioLabel: txt(p.cenarioLabel, 120),
        listaLabel: txt(p.listaLabel, 120),
        lista: lista(p.lista, 30).map((l) => txt(l, 600)).filter(Boolean),
        citacaoQuem: txt(p.citacaoQuem, 200),
        citacao: txt(p.citacao, 1200),
        depois: lista(p.depois, 20).map((l) => txt(l, 1200)).filter(Boolean),
        opcoes:
          tipo === 'escolha'
            ? lista(p.opcoes, 12)
                .map((o) => ({ chave: txt(o.chave, 4), texto: txt(o.texto, 800) }))
                .filter((o) => o.chave && o.texto)
            : [],
        itens: tipo === 'ordem' ? lista(p.itens, 20).map((i) => txt(i, 400)).filter(Boolean) : [],
        campoLabel: txt(p.campoLabel, 160),
      };
    })
    .filter((p) => p.id && p.titulo);

  if (!perguntas.length) throw new Error('É preciso ter pelo menos uma pergunta.');

  const idsPerguntas = new Set(perguntas.map((p) => p.id));
  if (idsPerguntas.size !== perguntas.length) {
    throw new Error('Há perguntas com o mesmo identificador.');
  }
  for (const p of perguntas) {
    if (!idsSecoes.has(p.secao)) {
      throw new Error(`A pergunta "${p.titulo.slice(0, 40)}" aponta para uma seção inexistente.`);
    }
    if (p.tipo === 'escolha' && p.opcoes.length < 2) {
      throw new Error(`A pergunta "${p.titulo.slice(0, 40)}" precisa de pelo menos 2 alternativas.`);
    }
    if (p.tipo === 'ordem' && p.itens.length < 2) {
      throw new Error(`A pergunta "${p.titulo.slice(0, 40)}" precisa de pelo menos 2 itens.`);
    }
  }

  // Mantém apenas seções que ainda têm perguntas; a ordem das seções segue a
  // ordem em que aparecem na lista de perguntas, que é o que a candidata vê.
  const ordemSecoes = [];
  for (const p of perguntas) if (!ordemSecoes.includes(p.secao)) ordemSecoes.push(p.secao);

  return {
    secoes: ordemSecoes.map((id) => secoes.find((s) => s.id === id)),
    perguntas,
  };
}

export async function onRequestGet({ request, env }) {
  const recusa = exigirChave(request, env);
  if (recusa) return recusa;
  try {
    return json(await lerQuestionario(env, 'closer'));
  } catch (e) {
    return erro(e.message, 500);
  }
}

export async function onRequestPut({ request, env }) {
  const recusa = exigirChave(request, env);
  if (recusa) return recusa;
  try {
    const dados = validar(await request.json());
    const atual = await lerQuestionario(env, 'closer');
    const versao = (atual.versao || 0) + 1;

    await supabase(env, vaga('closer').questionario, {
      method: 'POST',
      body: JSON.stringify({ versao, dados }),
    });

    return json({ ok: true, versao, ...dados });
  } catch (e) {
    return erro(e.message, 400);
  }
}
