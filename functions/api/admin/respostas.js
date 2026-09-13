// /api/admin/respostas — aba "Respostas" do painel. Exige a chave.
import {
  json, erro, supabase, exigirChave, TABELA_RESPOSTAS,
} from '../../../src/servidor.js';

const COLUNAS_LISTA = 'id,candidata,iniciado_em,enviado_em,tempo_total_ms,questionario_versao';

export async function onRequestGet({ request, env }) {
  const recusa = exigirChave(request, env);
  if (recusa) return recusa;
  try {
    const id = new URL(request.url).searchParams.get('id');

    if (id) {
      const r = await supabase(
        env,
        `${TABELA_RESPOSTAS}?select=*&id=eq.${encodeURIComponent(id)}&limit=1`
      );
      const [linha] = await r.json();
      if (!linha) return erro('Resposta não encontrada.', 404);
      return json(linha);
    }

    const r = await supabase(
      env,
      `${TABELA_RESPOSTAS}?select=${COLUNAS_LISTA}&order=enviado_em.desc&limit=500`
    );
    return json({ respostas: await r.json() });
  } catch (e) {
    return erro(e.message, 500);
  }
}

export async function onRequestDelete({ request, env }) {
  const recusa = exigirChave(request, env);
  if (recusa) return recusa;
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return erro('Informe qual resposta apagar.', 400);
    await supabase(env, `${TABELA_RESPOSTAS}?id=eq.${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return json({ ok: true });
  } catch (e) {
    return erro(e.message, 500);
  }
}
