// Renderização de uma pergunta. Compartilhada pelo formulário e pela
// pré-visualização do painel — por isso o que você vê no painel é
// literalmente o mesmo código que a candidata recebe.

import { h, paragrafos } from './dom.js';

/** A ajuda nasceu como texto e passou a aceitar várias linhas. Aceita os dois. */
function linhasDeAjuda(ajuda) {
  if (Array.isArray(ajuda)) return ajuda.filter(Boolean);
  return ajuda ? [ajuda] : [];
}

/**
 * @param {object} opcoes
 * @param {object} opcoes.pergunta      pergunta do questionário
 * @param {number} opcoes.numero        posição dela no formulário (1..n)
 * @param {string} opcoes.tituloSecao   nome da seção a que pertence
 * @param {object} opcoes.resposta      { texto, escolha, nota, ordem, arquivo } — é mutado
 * @param {function} opcoes.comNome     troca {nome} pelo nome de quem responde
 * @param {function} opcoes.aoAtualizar chamado quando algo muda e precisa redesenhar
 * @returns {{partes: Node[], area: HTMLTextAreaElement|null}}
 *          `area` é null nas perguntas de envio de arquivo, que não têm texto.
 */
export function renderPergunta({ pergunta: q, numero, tituloSecao, resposta: r, comNome, aoAtualizar }) {
  const nome = comNome || ((t) => String(t || ''));
  const atualizar = aoAtualizar || (() => {});
  if (q.tipo === 'ordem' && (!r.ordem || !r.ordem.length)) r.ordem = (q.itens || []).slice();

  const partes = [];

  partes.push(h('div', { class: 'pergunta-topo' },
    h('span', { class: 'pergunta-numero' }, `Pergunta ${String(numero).padStart(2, '0')}`),
    h('span', { class: 'pergunta-secao' }, nome(tituloSecao || '')),
    !q.obrigatoria ? h('span', { class: 'selo-opcional' }, 'Opcional') : null
  ));

  // Em algumas perguntas o enunciado é um título de abertura e vem antes do
  // cenário; no resto ele vem depois, como sempre foi.
  const titulo = h('h2', {
    class: `titulo-pergunta${q.destaque ? ' destaque' : ''}`,
  }, nome(q.titulo));
  if (q.tituloNoTopo) partes.push(titulo);

  if (q.cenario && q.cenario.length) {
    partes.push(h('div', { class: 'cartao' },
      h('div', { class: 'cartao-rotulo' }, nome(q.cenarioLabel || 'Cenário')),
      ...paragrafos(q.cenario.map(nome))
    ));
  }

  // Fala de alguém — a lead, o cliente — destacada como citação.
  if (q.citacao) {
    partes.push(h('div', { class: 'citacao' },
      q.citacaoQuem ? h('div', { class: 'citacao-quem' }, nome(q.citacaoQuem)) : null,
      h('p', { class: 'citacao-fala' }, `“${nome(q.citacao)}”`)
    ));
  }

  if (q.depois && q.depois.length) {
    partes.push(h('div', { class: 'texto-apos' }, ...paragrafos(q.depois.map(nome))));
  }

  if (!q.tituloNoTopo) partes.push(titulo);

  // Uma linha por parágrafo, cada um com a mesma marcação de sempre — assim o
  // caso de uma linha só continua exatamente como era.
  for (const linha of linhasDeAjuda(q.ajuda)) {
    partes.push(h('p', { class: 'ajuda' }, nome(linha)));
  }

  // Lista de pontos a cobrir na resposta ("Inclua: ...").
  if (q.lista && q.lista.length) {
    partes.push(h('div', { class: 'lista-pontos' },
      q.listaLabel ? h('div', { class: 'lista-rotulo' }, nome(q.listaLabel)) : null,
      h('ul', {}, ...q.lista.map((item) => h('li', {}, nome(item))))
    ));
  }

  if (q.tipo === 'escolha') {
    partes.push(h('div', { class: 'alternativas' },
      ...(q.opcoes || []).map((opcao) => h('button', {
        class: `alternativa${r.escolha === opcao.chave ? ' marcada' : ''}`,
        onclick: () => { r.escolha = opcao.chave; atualizar(); },
      },
        h('span', { class: 'chave' }, opcao.chave),
        h('span', { class: 'corpo' }, nome(opcao.texto))
      ))
    ));
  }

  if (q.tipo === 'escala') {
    partes.push(h('div', { class: 'escala' },
      h('div', { class: 'escala-numeros' },
        ...Array.from({ length: 11 }, (_, n) => h('button', {
          class: r.nota === n ? 'marcada' : '',
          onclick: () => { r.nota = n; atualizar(); },
        }, String(n)))
      ),
      h('div', { class: 'escala-pontas' },
        h('span', {}, 'Não combina'),
        h('span', {}, 'Combina totalmente')
      )
    ));
  }

  if (q.tipo === 'ordem') {
    const mover = (i, delta) => {
      const destino = i + delta;
      if (destino < 0 || destino >= r.ordem.length) return;
      [r.ordem[i], r.ordem[destino]] = [r.ordem[destino], r.ordem[i]];
      atualizar();
    };
    partes.push(h('div', { class: 'ordenacao' },
      ...r.ordem.map((item, i) => h('div', { class: 'ordem-item' },
        h('span', { class: 'ordem-pos' }, String(i + 1).padStart(2, '0')),
        h('span', { class: 'ordem-texto' }, nome(item)),
        h('span', { class: 'ordem-setas' },
          h('button', { onclick: () => mover(i, -1), 'aria-label': 'Subir' }, '↑'),
          h('button', { onclick: () => mover(i, 1), 'aria-label': 'Descer' }, '↓')
        )
      ))
    ));
  }

  // Pergunta de envio de arquivo: quem monta os controles é quem chamou, porque
  // gravar e enviar depende do servidor. Aqui fica só o lugar onde eles entram.
  if (q.tipo === 'upload') {
    const caixa = h('div', { class: 'envio' });
    partes.push(caixa);
    return { partes, area: null, caixaEnvio: caixa };
  }

  const area = h('textarea', {
    rows: q.linhas || 4,
    placeholder: 'Escreva sua resposta...',
  });
  area.value = r.texto || '';

  partes.push(h('div', { class: 'campo' },
    q.campoLabel ? h('div', { class: 'campo-rotulo' }, nome(q.campoLabel)) : null,
    area
  ));

  return { partes, area, caixaEnvio: null };
}
