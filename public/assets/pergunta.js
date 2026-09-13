// Renderização de uma pergunta. Compartilhada pelo formulário e pela
// pré-visualização do painel — por isso o que você vê no painel é
// literalmente o mesmo código que a candidata recebe.

import { h, paragrafos } from './dom.js';

/**
 * @param {object} opcoes
 * @param {object} opcoes.pergunta      pergunta do questionário
 * @param {number} opcoes.numero        posição dela no formulário (1..n)
 * @param {string} opcoes.tituloSecao   nome da seção a que pertence
 * @param {object} opcoes.resposta      { texto, escolha, nota, ordem } — é mutado
 * @param {function} opcoes.comNome     troca {nome} pelo nome da candidata
 * @param {function} opcoes.aoAtualizar chamado quando algo muda e precisa redesenhar
 * @returns {Node[]} os blocos da pergunta, sem os botões de navegação
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

  if (q.cenario && q.cenario.length) {
    partes.push(h('div', { class: 'cartao' },
      h('div', { class: 'cartao-rotulo' }, nome(q.cenarioLabel || 'Cenário')),
      ...paragrafos(q.cenario.map(nome))
    ));
  }

  partes.push(h('h2', { class: 'titulo-pergunta' }, nome(q.titulo)));
  if (q.ajuda) partes.push(h('p', { class: 'ajuda' }, nome(q.ajuda)));

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

  const area = h('textarea', {
    rows: q.linhas || 4,
    placeholder: 'Escreva sua resposta...',
  });
  area.value = r.texto || '';

  partes.push(h('div', { class: 'campo' },
    q.campoLabel ? h('div', { class: 'campo-rotulo' }, nome(q.campoLabel)) : null,
    area
  ));

  return { partes, area };
}
