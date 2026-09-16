// Painel interno: aba "Perguntas" (edita o questionário) e aba "Respostas"
// (lê o que as candidatas enviaram). O acesso é a chave que vem na URL (?k=).

import { h, minutos, dataHora } from './dom.js';
import { renderPergunta } from './pergunta.js';

const raiz = document.getElementById('painel');
const TIPOS = [
  ['texto', 'Resposta longa'],
  ['escolha', 'Múltipla escolha'],
  ['ordem', 'Ordenação'],
  ['escala', 'Escala 0 a 10'],
];

let chave = new URL(location.href).searchParams.get('k')
  || sessionStorage.getItem('atria_chave') || '';
let aba = 'perguntas';

let Q = null;
let versaoAtual = 0;
let sujo = false;
let salvando = false;
let aviso = '';
let avisoTipo = '';
let editando = null;
let previa = null;
let nomeExemplo = 'Déborah';
let secoesAbertas = false;
let rascunhoPrevia = null;

let listaRespostas = null;
let selecionada = null;
let carregando = false;

/* -------------------------------------------------------------- servidor */

async function api(caminho, opcoes = {}) {
  const r = await fetch(caminho, {
    ...opcoes,
    headers: { 'content-type': 'application/json', 'x-atria-chave': chave, ...(opcoes.headers || {}) },
  });
  const dados = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(dados.erro || `Erro ${r.status}`);
  return dados;
}

/* ------------------------------------------------------- estado do questionário */

function normalizar() {
  const porSecao = new Map(Q.secoes.map((s) => [s.id, []]));
  const orfas = [];
  for (const p of Q.perguntas) {
    if (porSecao.has(p.secao)) porSecao.get(p.secao).push(p);
    else orfas.push(p);
  }
  Q.perguntas = [...Q.secoes.flatMap((s) => porSecao.get(s.id)), ...orfas];
}

function novoId(prefixo, existentes) {
  let n = existentes.length + 1;
  const usados = new Set(existentes);
  while (usados.has(prefixo + n)) n += 1;
  return prefixo + n;
}

function marcarSujo(mensagem = '') {
  sujo = true;
  aviso = mensagem;
  avisoTipo = '';
  atualizarBarra();
}

/* --------------------------------------------------------------- salvar */

async function salvarQuestionario() {
  if (salvando) return;
  salvando = true;
  aviso = 'Salvando...';
  avisoTipo = '';
  atualizarBarra();
  try {
    normalizar();
    const dados = await api('/api/admin/questionario', {
      method: 'PUT',
      body: JSON.stringify({ secoes: Q.secoes, perguntas: Q.perguntas }),
    });
    Q = { secoes: dados.secoes, perguntas: dados.perguntas };
    versaoAtual = dados.versao;
    sujo = false;
    aviso = `Salvo. Versão ${dados.versao} — já vale para quem abrir o link a partir de agora.`;
    avisoTipo = 'ok';
  } catch (e) {
    aviso = e.message;
    avisoTipo = 'erro';
  } finally {
    salvando = false;
    desenhar();
  }
}

/* ------------------------------------------------------------ aba perguntas */

function editorSecoes() {
  const moverSecao = (i, delta) => {
    const destino = i + delta;
    if (destino < 0 || destino >= Q.secoes.length) return;
    [Q.secoes[i], Q.secoes[destino]] = [Q.secoes[destino], Q.secoes[i]];
    normalizar();
    marcarSujo();
    desenhar();
  };

  const excluirSecao = (secao) => {
    if (Q.perguntas.some((p) => p.secao === secao.id)) {
      aviso = 'Esta seção ainda tem perguntas. Mova ou exclua as perguntas dela primeiro.';
      avisoTipo = 'erro';
      atualizarBarra();
      return;
    }
    if (!confirm(`Excluir a seção "${secao.titulo}"?`)) return;
    Q.secoes = Q.secoes.filter((s) => s.id !== secao.id);
    marcarSujo();
    desenhar();
  };

  const cabecalho = h('div', { class: 'cartao-cabecalho' },
    h('h2', {}, `Seções (${Q.secoes.length})`),
    h('button', {
      class: 'btn-mini',
      onclick: () => { secoesAbertas = !secoesAbertas; desenhar(); },
    }, secoesAbertas ? 'Ocultar' : 'Editar seções')
  );

  if (!secoesAbertas) return h('div', { class: 'painel-cartao' }, cabecalho);

  return h('div', { class: 'painel-cartao' },
    cabecalho,
    h('div', { class: 'dica' },
      'A ordem das seções define a ordem das telas. Cada seção vira uma tela de abertura antes das perguntas dela.'),
    ...Q.secoes.map((secao, i) => h('div', { class: 'linha-pergunta' },
      h('span', { class: 'linha-num' }, String(i + 1).padStart(2, '0')),
      h('div', { class: 'linha-corpo' },
        h('div', { class: 'campo-admin' },
          h('label', {}, 'Título da seção'),
          entrada('input', secao.titulo, (v) => { secao.titulo = v; })
        ),
        h('div', { class: 'campo-admin' },
          h('label', {}, 'Texto de apoio (uma linha por parágrafo, opcional)'),
          entrada('textarea', (secao.nota || []).join('\n'),
            (v) => { secao.nota = v.split('\n').map((l) => l.trim()).filter(Boolean); }, 3)
        ),
        h('div', { class: 'linha-meta' },
          h('span', { class: 'selo' }, `${Q.perguntas.filter((p) => p.secao === secao.id).length} perguntas`)
        )
      ),
      h('div', { class: 'linha-botoes' },
        h('button', { class: 'btn-mini', disabled: i === 0, onclick: () => moverSecao(i, -1) }, '↑'),
        h('button', { class: 'btn-mini', disabled: i === Q.secoes.length - 1, onclick: () => moverSecao(i, 1) }, '↓'),
        h('button', { class: 'btn-mini perigo', onclick: () => excluirSecao(secao) }, 'Excluir')
      )
    )),
    h('div', {},
      h('button', {
        class: 'btn-mini',
        onclick: () => {
          const id = novoId('s', Q.secoes.map((s) => s.id));
          Q.secoes.push({ id, titulo: 'Nova seção', nota: [] });
          marcarSujo();
          desenhar();
        },
      }, '+ Adicionar seção')
    )
  );
}

/** Campo controlado que não redesenha a tela a cada tecla. */
function entrada(tag, valor, aoMudar, linhas) {
  const el = h(tag, linhas ? { rows: linhas } : {});
  el.value = valor || '';
  el.addEventListener('input', (e) => { aoMudar(e.target.value); marcarSujo(); });
  return el;
}

function editorPergunta(q) {
  const campos = [];

  campos.push(h('div', { class: 'campo-admin' },
    h('label', {}, 'Seção'),
    (() => {
      const sel = h('select', {});
      Q.secoes.forEach((s) => {
        const op = h('option', { value: s.id }, s.titulo);
        if (s.id === q.secao) op.selected = true;
        sel.appendChild(op);
      });
      sel.addEventListener('change', (e) => {
        q.secao = e.target.value;
        normalizar();
        marcarSujo();
        desenhar();
      });
      return sel;
    })()
  ));

  campos.push(h('div', { class: 'campo-admin' },
    h('label', {}, 'Tipo de resposta'),
    (() => {
      const sel = h('select', {});
      TIPOS.forEach(([valor, rotulo]) => {
        const op = h('option', { value: valor }, rotulo);
        if (valor === q.tipo) op.selected = true;
        sel.appendChild(op);
      });
      sel.addEventListener('change', (e) => {
        q.tipo = e.target.value;
        if (q.tipo === 'escolha' && !q.opcoes.length) {
          q.opcoes = [{ chave: 'A', texto: '' }, { chave: 'B', texto: '' }];
        }
        if (q.tipo === 'ordem' && !q.itens.length) q.itens = ['', ''];
        marcarSujo();
        desenhar();
      });
      return sel;
    })()
  ));

  campos.push(h('div', { class: 'campo-admin largo' },
    h('label', {}, 'Pergunta'),
    entrada('textarea', q.titulo, (v) => { q.titulo = v; }, 2)
  ));

  campos.push(h('div', { class: 'campo-admin largo' },
    h('label', {}, 'Texto de ajuda (opcional)'),
    entrada('textarea', q.ajuda, (v) => { q.ajuda = v; }, 2)
  ));

  campos.push(h('div', { class: 'campo-admin largo' },
    h('label', {}, 'Cenário — uma linha por parágrafo (opcional)'),
    entrada('textarea', (q.cenario || []).join('\n'),
      (v) => { q.cenario = v.split('\n').map((l) => l.trim()).filter(Boolean); }, 4),
    h('div', { class: 'auxiliar' }, 'Aparece no cartão com a barra dourada, acima da pergunta.')
  ));

  campos.push(h('div', { class: 'campo-admin' },
    h('label', {}, 'Rótulo do cenário'),
    entrada('input', q.cenarioLabel, (v) => { q.cenarioLabel = v; }),
    h('div', { class: 'auxiliar' }, 'Vazio = "Cenário".')
  ));

  campos.push(h('div', { class: 'campo-admin' },
    h('label', {}, 'Rótulo do campo de texto'),
    entrada('input', q.campoLabel, (v) => { q.campoLabel = v; }),
    h('div', { class: 'auxiliar' }, 'Ex.: "Explique sua resposta".')
  ));

  campos.push(h('div', { class: 'campo-admin' },
    h('label', {}, 'Altura do campo (linhas)'),
    (() => {
      const el = h('input', { type: 'number', min: '1', max: '20' });
      el.value = q.linhas;
      el.addEventListener('input', (e) => {
        q.linhas = Math.min(20, Math.max(1, Number(e.target.value) || 4));
        marcarSujo();
      });
      return el;
    })()
  ));

  campos.push(h('div', { class: 'campo-admin' },
    h('label', {}, 'Obrigatoriedade'),
    (() => {
      const caixa = h('input', { type: 'checkbox' });
      caixa.checked = q.obrigatoria;
      caixa.addEventListener('change', (e) => { q.obrigatoria = e.target.checked; marcarSujo(); });
      return h('label', { class: 'marcador' }, caixa, 'Pergunta obrigatória');
    })()
  ));

  if (q.tipo === 'escolha') {
    campos.push(h('div', { class: 'campo-admin largo' },
      h('label', {}, 'Alternativas'),
      ...q.opcoes.map((opcao, i) => h('div', { class: 'linha-opcao' },
        entrada('input', opcao.chave, (v) => { opcao.chave = v; }),
        entrada('input', opcao.texto, (v) => { opcao.texto = v; }),
        h('button', {
          class: 'btn-mini perigo',
          onclick: () => { q.opcoes.splice(i, 1); marcarSujo(); desenhar(); },
        }, '×')
      )),
      h('div', {},
        h('button', {
          class: 'btn-mini',
          onclick: () => {
            const letra = String.fromCharCode(65 + q.opcoes.length);
            q.opcoes.push({ chave: letra, texto: '' });
            marcarSujo();
            desenhar();
          },
        }, '+ Alternativa')
      )
    ));
  }

  if (q.tipo === 'ordem') {
    campos.push(h('div', { class: 'campo-admin largo' },
      h('label', {}, 'Itens para ordenar — uma linha por item'),
      entrada('textarea', (q.itens || []).join('\n'),
        (v) => { q.itens = v.split('\n').map((l) => l.trim()).filter(Boolean); }, 5)
    ));
  }

  campos.push(h('div', { class: 'campo-admin largo' },
    h('div', { class: 'auxiliar' },
      'Escreva {nome} em qualquer texto para inserir o primeiro nome da candidata.')
  ));

  return h('div', { class: 'editor' }, ...campos);
}

function abaPerguntas() {
  const blocos = [];
  let secaoAnterior = null;

  Q.perguntas.forEach((q, i) => {
    if (q.secao !== secaoAnterior) {
      secaoAnterior = q.secao;
      const secao = Q.secoes.find((s) => s.id === q.secao);
      blocos.push(h('div', { class: 'faixa-secao' }, secao ? secao.titulo : q.secao));
    }

    const irmas = Q.perguntas.filter((p) => p.secao === q.secao);
    const posicao = irmas.indexOf(q);

    const mover = (delta) => {
      const alvo = irmas[posicao + delta];
      if (!alvo) return;
      const a = Q.perguntas.indexOf(q);
      const b = Q.perguntas.indexOf(alvo);
      [Q.perguntas[a], Q.perguntas[b]] = [Q.perguntas[b], Q.perguntas[a]];
      marcarSujo();
      desenhar();
    };

    blocos.push(h('div', { class: 'linha-pergunta' },
      h('span', { class: 'linha-num' }, String(i + 1).padStart(2, '0')),
      h('div', { class: 'linha-corpo' },
        h('div', { class: 'linha-titulo' }, q.titulo || '(sem texto)'),
        h('div', { class: 'linha-meta' },
          h('span', { class: 'selo tipo' }, (TIPOS.find((t) => t[0] === q.tipo) || [, q.tipo])[1]),
          h('span', { class: 'selo' }, q.obrigatoria ? 'Obrigatória' : 'Opcional'),
          q.cenario && q.cenario.length ? h('span', { class: 'selo' }, 'Com cenário') : null
        ),
        editando === q.id ? editorPergunta(q) : null
      ),
      h('div', { class: 'linha-botoes' },
        h('button', { class: 'btn-mini', disabled: posicao === 0, onclick: () => mover(-1) }, '↑'),
        h('button', { class: 'btn-mini', disabled: posicao === irmas.length - 1, onclick: () => mover(1) }, '↓'),
        h('button', {
          class: 'btn-mini',
          onclick: () => { editando = editando === q.id ? null : q.id; desenhar(); },
        }, editando === q.id ? 'Fechar' : 'Editar'),
        h('button', {
          class: 'btn-mini',
          onclick: () => {
            previa = q.id;
            rascunhoPrevia = { texto: '', escolha: '', nota: null, ordem: [] };
            desenhar();
          },
        }, 'Prever'),
        h('button', {
          class: 'btn-mini perigo',
          onclick: () => {
            if (!confirm(`Excluir a pergunta "${(q.titulo || '').slice(0, 60)}"?`)) return;
            Q.perguntas = Q.perguntas.filter((p) => p.id !== q.id);
            if (editando === q.id) editando = null;
            marcarSujo();
            desenhar();
          },
        }, 'Excluir')
      )
    ));
  });

  return h('div', { class: 'painel-corpo' },
    h('div', { class: 'secao-cabecalho' },
      h('h1', {}, 'Perguntas'),
      h('div', { class: 'painel-sub' },
        versaoAtual ? `Versão ${versaoAtual} publicada` : 'Ainda usando o questionário original')
    ),
    h('div', { class: 'dica' },
      'Esta é a ordem exata que a candidata vê. Use "Prever" para abrir a pergunta com a mesma aparência do formulário. As mudanças só valem depois de salvar, e só para quem abrir o link a partir daí — as respostas já enviadas ficam guardadas com a versão em que foram feitas.'),
    editorSecoes(),
    h('div', { class: 'painel-cartao' },
      h('h2', {}, `Perguntas (${Q.perguntas.length})`),
      ...blocos,
      h('div', { style: 'margin-top:12px' },
        h('button', {
          class: 'btn-mini',
          onclick: () => {
            const id = novoId('q', Q.perguntas.map((p) => p.id));
            const secao = Q.secoes[Q.secoes.length - 1];
            if (!secao) return;
            Q.perguntas.push({
              id, secao: secao.id, tipo: 'texto', obrigatoria: true, linhas: 5,
              titulo: 'Nova pergunta', ajuda: '', cenario: [], cenarioLabel: '',
              opcoes: [], itens: [], campoLabel: '',
            });
            editando = id;
            marcarSujo();
            desenhar();
          },
        }, '+ Adicionar pergunta')
      )
    )
  );
}

function modalPrevia() {
  const q = Q.perguntas.find((p) => p.id === previa);
  if (!q) return null;
  const secao = Q.secoes.find((s) => s.id === q.secao);
  const numero = Q.perguntas.indexOf(q) + 1;
  if (!rascunhoPrevia) rascunhoPrevia = { texto: '', escolha: '', nota: null, ordem: [] };

  const palco = h('div', { class: 'atria' });
  const montar = () => {
    const { partes } = renderPergunta({
      pergunta: q,
      numero,
      tituloSecao: secao ? secao.titulo : '',
      resposta: rascunhoPrevia,
      comNome: (t) => String(t || '').split('{nome}').join(nomeExemplo || ''),
      aoAtualizar: montar,
    });
    palco.replaceChildren(h('div', { class: 'bloco junto' }, ...partes));
  };
  montar();

  const campoNome = h('input', { type: 'text' });
  campoNome.value = nomeExemplo;
  campoNome.addEventListener('input', (e) => { nomeExemplo = e.target.value; montar(); });

  const fechar = () => { previa = null; rascunhoPrevia = null; desenhar(); };

  const caixa = h('div', { class: 'modal-caixa' },
    h('div', { class: 'modal-topo' },
      h('span', { class: 'modal-titulo' }, `Como a candidata vê — pergunta ${numero}`),
      h('button', { class: 'btn-mini', onclick: fechar }, 'Fechar')
    ),
    h('div', { class: 'campo-admin' },
      h('label', {}, 'Visualizar com o nome'),
      campoNome
    ),
    palco
  );

  const fundo = h('div', { class: 'modal', onclick: (e) => { if (e.target === fundo) fechar(); } }, caixa);
  return fundo;
}

/* ------------------------------------------------------------ aba respostas */

async function carregarRespostas() {
  carregando = true;
  desenhar();
  try {
    const dados = await api('/api/admin/respostas');
    listaRespostas = dados.respostas;
  } catch (e) {
    aviso = e.message;
    avisoTipo = 'erro';
    listaRespostas = [];
  } finally {
    carregando = false;
    desenhar();
  }
}

async function abrirResposta(id) {
  try {
    selecionada = await api(`/api/admin/respostas?id=${encodeURIComponent(id)}`);
    desenhar();
  } catch (e) {
    aviso = e.message;
    avisoTipo = 'erro';
    desenhar();
  }
}

function perguntasDaResposta(registro) {
  const snap = registro.questionario_snapshot;
  if (snap && Array.isArray(snap.perguntas) && snap.perguntas.length) return snap;
  return { secoes: Q ? Q.secoes : [], perguntas: Q ? Q.perguntas : [] };
}

function valorDestaque(q, r) {
  if (!r) return '';
  if (q.tipo === 'escolha') return r.escolha ? `Alternativa ${r.escolha}` : 'Sem alternativa';
  if (q.tipo === 'escala') {
    return r.nota !== null && r.nota !== undefined ? `Nota ${r.nota} de 10` : 'Sem nota';
  }
  if (q.tipo === 'ordem') {
    return (r.ordem || []).length
      ? (r.ordem || []).map((t, i) => `${i + 1}. ${t}`).join('\n')
      : 'Sem ordenação';
  }
  return '';
}

function detalheResposta() {
  const reg = selecionada;
  const { perguntas } = perguntasDaResposta(reg);

  const { secoes } = perguntasDaResposta(reg);
  const nome = (t) => String(t || '').split('{nome}').join((reg.candidata || '').split(/\s+/)[0]);

  // Cada resposta guarda uma cópia do questionário como estava no envio, então
  // o que aparece aqui é exatamente o que a candidata leu naquele dia.
  const itens = perguntas.map((q, i) => {
    const r = (reg.respostas || {})[q.id] || {};
    const texto = (r.texto || '').trim();
    const secao = secoes.find((x) => x.id === q.secao);

    return h('div', { class: 'resposta-item' },
      h('div', { class: 'resposta-cabecalho' },
        h('div', { class: 'resposta-indice' },
          `Pergunta ${String(i + 1).padStart(2, '0')}`,
          secao ? ` · ${nome(secao.titulo)}` : ''),
        h('div', { class: 'resposta-tempo' }, minutos((reg.tempos || {})[q.id]))
      ),

      q.cenario && q.cenario.length
        ? h('div', { class: 'cartao lida' },
            h('div', { class: 'cartao-rotulo' }, nome(q.cenarioLabel || 'Cenário')),
            ...q.cenario.map((linha) => h('p', {}, nome(linha))))
        : null,

      h('div', { class: 'resposta-enunciado' }, nome(q.titulo)),
      q.ajuda ? h('div', { class: 'resposta-ajuda' }, nome(q.ajuda)) : null,

      q.tipo === 'escolha' && (q.opcoes || []).length
        ? h('div', { class: 'resposta-alternativas' },
            ...q.opcoes.map((o) => h('div', {
              class: `resposta-alternativa${r.escolha === o.chave ? ' marcada' : ''}`,
            },
              h('span', { class: 'chave' }, o.chave),
              h('span', { class: 'corpo' }, nome(o.texto)),
              r.escolha === o.chave ? h('span', { class: 'marca' }, 'escolhida') : null
            )))
        : null,

      q.tipo === 'escala'
        ? h('div', { class: 'resposta-destaque' },
            r.nota !== null && r.nota !== undefined ? `Nota ${r.nota} de 10` : 'Sem nota')
        : null,

      q.tipo === 'ordem'
        ? h('div', { class: 'resposta-ordem' },
            (r.ordem || []).length
              ? h('div', {}, ...(r.ordem || []).map((t, n) => h('div', { class: 'ordem-linha' },
                  h('span', { class: 'ordem-n' }, String(n + 1).padStart(2, '0')),
                  h('span', {}, nome(t)))))
              : h('div', { class: 'resposta-texto vazia' }, 'Sem ordenação'))
        : null,

      h('div', { class: 'resposta-rotulo' }, q.campoLabel ? nome(q.campoLabel) : 'Resposta'),
      h('div', { class: `resposta-texto${texto ? '' : ' vazia'}` }, texto || 'Sem resposta')
    );
  });

  return h('div', { class: 'painel-cartao' },
    h('div', { class: 'secao-cabecalho' },
      h('h1', {}, reg.candidata),
      h('div', { class: 'linha-botoes' },
        h('button', { class: 'btn-mini', onclick: () => baixarTxt(reg) }, 'Baixar TXT'),
        h('button', { class: 'btn-mini', onclick: () => baixarCsv(reg) }, 'Baixar CSV'),
        h('button', { class: 'btn-mini perigo', onclick: () => excluirResposta(reg) }, 'Excluir')
      )
    ),
    h('div', { class: 'resumo' },
      h('div', { class: 'resumo-item' },
        h('div', { class: 'resumo-rotulo' }, 'Tempo total'),
        h('div', { class: 'resumo-valor' }, minutos(reg.tempo_total_ms))
      ),
      h('div', { class: 'resumo-item' },
        h('div', { class: 'resumo-rotulo' }, 'Começou'),
        h('div', { class: 'candidata-meta' }, dataHora(reg.iniciado_em))
      ),
      h('div', { class: 'resumo-item' },
        h('div', { class: 'resumo-rotulo' }, 'Enviou'),
        h('div', { class: 'candidata-meta' }, dataHora(reg.enviado_em))
      ),
      h('div', { class: 'resumo-item' },
        h('div', { class: 'resumo-rotulo' }, 'Respondidas'),
        h('div', { class: 'resumo-valor' },
          `${perguntas.filter((q) => ((reg.respostas || {})[q.id] || {}).texto?.trim()).length}/${perguntas.length}`)
      )
    ),
    ...itens
  );
}

function abaRespostas() {
  if (listaRespostas === null && !carregando) carregarRespostas();

  const lista = h('div', { class: 'painel-cartao' },
    h('h2', {}, `Candidatas (${listaRespostas ? listaRespostas.length : 0})`),
    carregando ? h('div', { class: 'vazio' }, 'Carregando...') : null,
    !carregando && listaRespostas && !listaRespostas.length
      ? h('div', { class: 'vazio' }, 'Nenhuma resposta recebida ainda.') : null,
    ...(listaRespostas || []).map((r) => h('button', {
      class: `candidata${selecionada && selecionada.id === r.id ? ' ativa' : ''}`,
      onclick: () => abrirResposta(r.id),
    },
      h('div', { class: 'candidata-nome' }, r.candidata),
      h('div', { class: 'candidata-meta' }, `${dataHora(r.enviado_em)} · ${minutos(r.tempo_total_ms)}`)
    )),
    listaRespostas && listaRespostas.length
      ? h('div', { style: 'margin-top:12px' },
          h('button', { class: 'btn-mini', onclick: baixarCsvTodas }, 'CSV de todas'))
      : null
  );

  return h('div', { class: 'painel-corpo' },
    h('div', { class: 'secao-cabecalho' },
      h('h1', {}, 'Respostas'),
      h('button', { class: 'btn-mini', onclick: carregarRespostas }, 'Atualizar')
    ),
    avisoTipo === 'erro' && aviso ? h('p', { class: 'erro-envio' }, aviso) : null,
    h('div', { class: 'respostas-grade' },
      lista,
      selecionada ? detalheResposta()
        : h('div', { class: 'painel-cartao' },
            h('div', { class: 'vazio' }, 'Escolha uma candidata ao lado para ver as respostas.'))
    )
  );
}

async function excluirResposta(reg) {
  if (!confirm(`Excluir definitivamente as respostas de ${reg.candidata}?`)) return;
  try {
    await api(`/api/admin/respostas?id=${encodeURIComponent(reg.id)}`, { method: 'DELETE' });
    selecionada = null;
    await carregarRespostas();
  } catch (e) {
    aviso = e.message;
    avisoTipo = 'erro';
    desenhar();
  }
}

/* ------------------------------------------------------------ exportação */

function baixarArquivo(nome, conteudo, tipo) {
  const blob = new Blob([conteudo], { type: `${tipo};charset=utf-8` });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = nome;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

function apelido(reg) {
  return (reg.candidata || 'candidata').toLowerCase().normalize('NFD')
    .replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function transcricao(reg) {
  const { secoes, perguntas } = perguntasDaResposta(reg);
  const nome = (t) => String(t || '').split('{nome}').join((reg.candidata || '').split(/\s+/)[0]);
  const linhas = [
    'ATRIA — Etapa de seleção',
    `Candidata: ${reg.candidata}`,
    `Começou: ${dataHora(reg.iniciado_em)}`,
    `Enviou: ${dataHora(reg.enviado_em)}`,
    `Tempo total: ${minutos(reg.tempo_total_ms)}`,
    '',
  ];
  for (const secao of secoes) {
    const daSecao = perguntas.filter((q) => q.secao === secao.id);
    if (!daSecao.length) continue;
    linhas.push(`== ${nome(secao.titulo).toUpperCase()} ==`, '');
    for (const q of daSecao) {
      const r = (reg.respostas || {})[q.id] || {};
      linhas.push(`${perguntas.indexOf(q) + 1}. ${nome(q.titulo)}`);
      linhas.push(`Tempo: ${minutos((reg.tempos || {})[q.id])}`);

      // O que ela leu junto da pergunta, para o texto ficar autoexplicativo.
      if (q.cenario && q.cenario.length) {
        linhas.push(`[${nome(q.cenarioLabel || 'Cenário')}]`);
        for (const linha of q.cenario) linhas.push(`  ${nome(linha)}`);
      }
      if (q.ajuda) linhas.push(`(${nome(q.ajuda)})`);

      if (q.tipo === 'escolha') {
        for (const o of q.opcoes || []) {
          const marca = r.escolha === o.chave ? '>' : ' ';
          linhas.push(`${marca} ${o.chave}) ${nome(o.texto)}`);
        }
        if (!r.escolha) linhas.push('  (nenhuma alternativa escolhida)');
      } else {
        const destaque = valorDestaque(q, r);
        if (destaque) linhas.push(destaque);
      }

      linhas.push(`${q.campoLabel ? nome(q.campoLabel) : 'Resposta'}: ${(r.texto || '').trim() || '—'}`, '');
    }
  }
  return linhas.join('\n');
}

function celula(valor) {
  let s = valor === null || valor === undefined ? '' : String(valor);
  if (/^[=+\-@]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

function csv(linhas) {
  return `﻿${linhas.map((l) => l.map(celula).join(';')).join('\r\n')}`;
}

const CABECALHO_CSV = [
  'Candidata', 'Enviado em', 'Tempo total', 'Nº', 'Seção', 'Pergunta', 'Tipo',
  'Alternativa', 'Nota', 'Ordenação', 'Resposta', 'Tempo na pergunta',
];

function linhasCsv(reg) {
  const { secoes, perguntas } = perguntasDaResposta(reg);
  const nome = (t) => String(t || '').split('{nome}').join((reg.candidata || '').split(/\s+/)[0]);
  return perguntas.map((q, i) => {
    const r = (reg.respostas || {})[q.id] || {};
    const secao = secoes.find((s) => s.id === q.secao);
    return [
      reg.candidata,
      dataHora(reg.enviado_em),
      minutos(reg.tempo_total_ms),
      i + 1,
      secao ? nome(secao.titulo) : q.secao,
      nome(q.titulo),
      (TIPOS.find((t) => t[0] === q.tipo) || [, q.tipo])[1],
      r.escolha || '',
      r.nota !== null && r.nota !== undefined ? r.nota : '',
      (r.ordem || []).map((t, n) => `${n + 1}. ${t}`).join(' | '),
      (r.texto || '').trim(),
      minutos((reg.tempos || {})[q.id]),
    ];
  });
}

function baixarTxt(reg) {
  baixarArquivo(`atria-${apelido(reg)}.txt`, transcricao(reg), 'text/plain');
}

function baixarCsv(reg) {
  baixarArquivo(`atria-${apelido(reg)}.csv`, csv([CABECALHO_CSV, ...linhasCsv(reg)]), 'text/csv');
}

async function baixarCsvTodas() {
  try {
    const completos = await Promise.all(
      (listaRespostas || []).map((r) => api(`/api/admin/respostas?id=${encodeURIComponent(r.id)}`))
    );
    const linhas = [CABECALHO_CSV, ...completos.flatMap(linhasCsv)];
    baixarArquivo('atria-todas-candidatas.csv', csv(linhas), 'text/csv');
  } catch (e) {
    aviso = e.message;
    avisoTipo = 'erro';
    desenhar();
  }
}

/* --------------------------------------------------------------- desenho */

function barraSalvar() {
  if (aba !== 'perguntas') return null;
  if (!sujo && !aviso) return null;
  return h('div', { class: 'barra-salvar', id: 'barra-salvar' },
    h('div', { class: 'barra-salvar-interno' },
      h('div', { class: `barra-aviso${avisoTipo ? ` ${avisoTipo}` : ''}` },
        aviso || 'Você tem alterações que ainda não foram salvas.'),
      sujo ? h('button', {
        class: 'btn-mini',
        onclick: () => { carregarQuestionario().then(desenhar); },
      }, 'Descartar') : null,
      sujo ? h('button', {
        class: 'btn-ouro secao', disabled: salvando, onclick: salvarQuestionario,
      }, salvando ? 'Salvando...' : 'Salvar alterações') : null
    )
  );
}

function atualizarBarra() {
  const antiga = document.getElementById('barra-salvar');
  const nova = barraSalvar();
  if (antiga && nova) antiga.replaceWith(nova);
  else if (antiga) antiga.remove();
  else if (nova) raiz.appendChild(nova);
}

function topo() {
  const trocar = (destino) => { aba = destino; aviso = ''; avisoTipo = ''; desenhar(); };
  return h('div', { class: 'painel-topo' },
    h('div', { class: 'painel-topo-interno' },
      h('div', { class: 'painel-marca' }, 'ATRIA'),
      h('div', { class: 'painel-sub' }, 'Painel de seleção'),
      h('div', { class: 'abas' },
        h('button', { class: `aba${aba === 'perguntas' ? ' ativa' : ''}`, onclick: () => trocar('perguntas') }, 'Perguntas'),
        h('button', { class: `aba${aba === 'respostas' ? ' ativa' : ''}`, onclick: () => trocar('respostas') }, 'Respostas')
      )
    )
  );
}

function desenhar() {
  if (!Q) return;
  raiz.replaceChildren(...[
    topo(),
    aba === 'perguntas' ? abaPerguntas() : abaRespostas(),
    previa ? modalPrevia() : null,
    barraSalvar(),
  ].filter(Boolean));
}

/* ---------------------------------------------------------------- entrada */

function portao(mensagem) {
  const campo = h('input', { type: 'password', placeholder: 'Cole a chave do painel' });
  const entrar = () => {
    chave = campo.value.trim();
    if (!chave) return;
    sessionStorage.setItem('atria_chave', chave);
    iniciar();
  };
  campo.addEventListener('keydown', (e) => { if (e.key === 'Enter') entrar(); });

  raiz.replaceChildren(h('div', { class: 'portao' },
    h('div', { class: 'portao-caixa' },
      h('div', { class: 'painel-marca' }, 'ATRIA'),
      h('h1', { class: 'titulo-medio' }, 'Painel'),
      mensagem ? h('p', { class: 'erro-envio' }, mensagem) : null,
      h('div', { class: 'campo-admin' }, h('label', {}, 'Chave de acesso'), campo),
      h('button', { class: 'btn-ouro secao', onclick: entrar }, 'Entrar')
    )
  ));
  setTimeout(() => campo.focus(), 60);
}

async function carregarQuestionario() {
  const dados = await api('/api/admin/questionario');
  Q = { secoes: dados.secoes, perguntas: dados.perguntas };
  versaoAtual = dados.padrao ? 0 : dados.versao;
  sujo = false;
  aviso = '';
  avisoTipo = '';
}

async function iniciar() {
  if (!chave) { portao(''); return; }
  try {
    await carregarQuestionario();
    sessionStorage.setItem('atria_chave', chave);
    desenhar();
  } catch (e) {
    portao(e.message);
  }
}

window.addEventListener('beforeunload', (e) => {
  if (sujo) { e.preventDefault(); e.returnValue = ''; }
});

iniciar();
