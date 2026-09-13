// Formulário de seleção da ATRIA.
// As perguntas vêm do servidor (editáveis no painel). O progresso fica no
// navegador enquanto ela responde e só vai para o banco no envio.

import { h, paragrafos } from './dom.js';
import { TELA_NOME, INTROS } from './aberturas.js';
import { renderPergunta } from './pergunta.js';

const CHAVE_LOCAL = 'atria_selecao_v2';
const app = document.getElementById('app');

let Q = null;
let passos = [];
let esmaecendo = false;
let enviando = false;
let erroEnvio = '';
let revisaoAberta = true;
let copiado = false;
let entradaEm = Date.now();

const est = {
  candidata: '',
  iniciadoEm: null,
  passo: 0,
  respostas: {},
  tempos: {},
  enviado: false,
};

/* ---------------------------------------------------------------- estado */

function resposta(id) {
  if (!est.respostas[id]) {
    est.respostas[id] = { texto: '', escolha: '', nota: null, ordem: [] };
  }
  return est.respostas[id];
}

function primeiroNome() {
  return (est.candidata || '').trim().split(/\s+/)[0] || '';
}

/** Troca {nome} pelo primeiro nome da candidata. */
function comNome(texto) {
  return String(texto || '').split('{nome}').join(primeiroNome());
}

function salvar() {
  try {
    localStorage.setItem(CHAVE_LOCAL, JSON.stringify(est));
  } catch {
    /* navegador sem armazenamento — o formulário continua funcionando */
  }
}

function restaurar() {
  try {
    const bruto = localStorage.getItem(CHAVE_LOCAL);
    if (!bruto) return;
    const d = JSON.parse(bruto);
    if (!d || d.enviado) return;
    Object.assign(est, {
      candidata: d.candidata || '',
      iniciadoEm: d.iniciadoEm || null,
      respostas: d.respostas || {},
      tempos: d.tempos || {},
      passo: typeof d.passo === 'number' ? Math.min(d.passo, passos.length - 2) : 0,
    });
  } catch {
    /* dado corrompido: começa do zero */
  }
}

/* ------------------------------------------------------------- cronômetro */

function contabilizarTempo() {
  const agora = Date.now();
  const atual = passos[est.passo];
  if (atual && atual.k === 'pergunta') {
    const id = atual.pergunta.id;
    est.tempos[id] = (est.tempos[id] || 0) + (agora - entradaEm);
  }
  entradaEm = agora;
}

// Não conta o tempo com a aba em segundo plano.
document.addEventListener('visibilitychange', () => {
  if (document.hidden) contabilizarTempo();
  else entradaEm = Date.now();
});

/* ---------------------------------------------------------------- navegação */

function montarPassos() {
  const lista = [{ k: 'nome' }];
  INTROS.forEach((_, indice) => lista.push({ k: 'intro', indice }));

  let secaoAtual = null;
  let numeroSecao = 0;
  let numeroPergunta = 0;

  for (const pergunta of Q.perguntas) {
    if (pergunta.secao !== secaoAtual) {
      secaoAtual = pergunta.secao;
      numeroSecao += 1;
      const secao = Q.secoes.find((s) => s.id === secaoAtual) || {
        id: secaoAtual, titulo: '', nota: [],
      };
      lista.push({ k: 'secao', secao, numero: numeroSecao });
    }
    numeroPergunta += 1;
    lista.push({ k: 'pergunta', pergunta, numero: numeroPergunta });
  }

  lista.push({ k: 'revisao' }, { k: 'fim' });
  return lista;
}

function irPara(indice) {
  const destino = Math.max(0, Math.min(passos.length - 1, indice));
  if (destino === est.passo) return;
  contabilizarTempo();
  esmaecendo = true;
  desenhar();
  setTimeout(() => {
    est.passo = destino;
    esmaecendo = false;
    entradaEm = Date.now();
    salvar();
    desenhar();
    window.scrollTo(0, 0);
  }, 240);
}

const proximo = () => irPara(est.passo + 1);
const anterior = () => irPara(est.passo - 1);

/* ------------------------------------------------------------------ topo */

function rotuloEtapa(p) {
  if (p.k === 'secao') return `Seção ${p.numero}`;
  if (p.k === 'pergunta') return `${p.numero} de ${Q.perguntas.length}`;
  if (p.k === 'revisao') return 'Revisão';
  if (p.k === 'fim') return 'Concluído';
  return 'Apresentação';
}

function progresso(p) {
  const total = Q.perguntas.length;
  if (p.k === 'pergunta') return (p.numero / total) * 100;
  if (p.k === 'secao') {
    const antes = Q.perguntas.filter(
      (q) => ordemDaSecao(q.secao) < ordemDaSecao(p.secao.id)
    ).length;
    return (antes / total) * 100;
  }
  if (p.k === 'revisao' || p.k === 'fim') return 100;
  return 0;
}

function ordemDaSecao(id) {
  return Q.secoes.findIndex((s) => s.id === id);
}

function tituloSecao(id) {
  const secao = Q.secoes.find((s) => s.id === id);
  return secao ? comNome(secao.titulo) : '';
}

function desenharTopo(p) {
  const barra = h('span', {});
  barra.style.width = `${Math.round(progresso(p))}%`;

  return h('div', { class: 'topo' },
    h('div', { class: 'topo-interno' },
      h('div', { class: 'marca' }, 'ATRIA'),
      h('div', { class: 'trilho' }, barra),
      h('div', { class: 'etapa' }, rotuloEtapa(p)),
      h('button', {
        class: 'btn-topo',
        onclick: () => irPara(est.candidata ? 1 : 0),
      }, 'Início')
    )
  );
}

/* --------------------------------------------------------------- telas */

function telaEstatica(html) {
  const caixa = document.createElement('div');
  caixa.innerHTML = html;
  caixa.querySelectorAll('[data-acao=proximo]').forEach((b) =>
    b.addEventListener('click', proximo));
  caixa.querySelectorAll('[data-acao=anterior]').forEach((b) =>
    b.addEventListener('click', anterior));
  return caixa.firstElementChild;
}

function telaNome() {
  const no = telaEstatica(TELA_NOME);
  const campo = no.querySelector('#campo-nome');
  const botao = no.querySelector('[data-acao=comecar]');
  campo.value = est.candidata;

  const seguir = () => {
    const nome = campo.value.trim();
    if (!nome) {
      campo.focus();
      return;
    }
    est.candidata = nome;
    if (!est.iniciadoEm) est.iniciadoEm = new Date().toISOString();
    salvar();
    proximo();
  };

  campo.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); seguir(); }
  });
  botao.addEventListener('click', seguir);
  setTimeout(() => campo.focus(), 60);
  return no;
}

function telaSecao(p) {
  const secao = p.secao;
  return h('div', { class: 'bloco medio' },
    h('div', { class: 'secao-topo' },
      h('span', { class: 'secao-numero' }, String(p.numero).padStart(2, '0')),
      h('span', { class: 'secao-rotulo' }, 'Seção')
    ),
    h('h2', { class: 'titulo-secao' }, comNome(secao.titulo)),
    secao.nota && secao.nota.length
      ? h('div', { class: 'nota-secao' }, ...paragrafos(secao.nota.map(comNome)))
      : null,
    h('div', { class: 'acoes' },
      h('button', { class: 'btn-ouro secao', onclick: proximo }, 'Continuar'),
      h('button', { class: 'btn-voltar', onclick: anterior }, '← Voltar')
    )
  );
}

function telaPergunta(p) {
  const q = p.pergunta;
  const r = resposta(q.id);

  const { partes, area } = renderPergunta({
    pergunta: q,
    numero: p.numero,
    tituloSecao: tituloSecao(q.secao),
    resposta: r,
    comNome,
    aoAtualizar: () => { salvar(); desenhar(); },
  });

  area.addEventListener('input', (e) => { r.texto = e.target.value; salvar(); });
  area.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); proximo(); }
  });

  partes.push(h('div', { class: 'acoes' },
    h('button', { class: 'btn-ouro seguir', onclick: proximo }, 'Continuar →'),
    h('button', { class: 'btn-voltar', onclick: anterior }, '← Voltar'),
    h('span', { class: 'aviso-salvo' }, 'Progresso salvo automaticamente')
  ));

  setTimeout(() => { try { area.focus({ preventScroll: true }); } catch { /* noop */ } }, 60);
  return h('div', { class: 'bloco junto' }, ...partes);
}

function resumoResposta(q) {
  const r = resposta(q.id);
  const texto = (r.texto || '').trim();
  if (q.tipo === 'escolha') {
    return (r.escolha ? `Alternativa ${r.escolha}` : 'Sem alternativa') + (texto ? `\n${texto}` : '');
  }
  if (q.tipo === 'escala') {
    return (r.nota !== null && r.nota !== undefined ? `Nota ${r.nota}/10` : 'Sem nota')
      + (texto ? `\n${texto}` : '');
  }
  if (q.tipo === 'ordem') {
    const ordem = (r.ordem || []).map((t, n) => `${n + 1}. ${comNome(t)}`).join('\n');
    return ordem + (texto ? `\n\n${texto}` : '');
  }
  return texto || 'Sem resposta';
}

function telaRevisao() {
  const itens = Q.perguntas.map((q, i) => {
    const indice = passos.findIndex((s) => s.k === 'pergunta' && s.pergunta.id === q.id);
    const vazia = !(resposta(q.id).texto || '').trim();
    return h('div', { class: 'revisao-item' },
      h('div', { class: 'revisao-cabecalho' },
        h('div', { class: 'revisao-titulo' }, `${i + 1}. ${comNome(q.titulo)}`),
        h('button', { class: 'revisao-editar', onclick: () => irPara(indice) }, 'Editar')
      ),
      h('div', {
        class: `revisao-resposta${vazia && q.obrigatoria ? ' faltando' : ''}`,
      }, resumoResposta(q))
    );
  });

  return h('div', { class: 'bloco medio' },
    h('h2', { class: 'titulo-final' }, comNome('Pronto, {nome}.')),
    h('p', { class: 'revisao-intro' },
      'Suas respostas estão completas. Você pode revisar antes de enviar.'),
    revisaoAberta ? h('div', { class: 'revisao' }, ...itens) : null,
    erroEnvio ? h('p', { class: 'erro-envio' }, erroEnvio) : null,
    h('div', { class: 'acoes solta' },
      h('button', {
        class: 'btn-ouro enviar', disabled: enviando, onclick: enviar,
      },
        enviando ? h('span', { class: 'girando' }) : null,
        enviando ? 'Enviando' : 'Enviar respostas'
      ),
      h('button', {
        class: 'btn-contorno',
        onclick: () => { revisaoAberta = !revisaoAberta; desenhar(); },
      }, revisaoAberta ? 'Ocultar respostas' : 'Revisar respostas')
    )
  );
}

function telaFim() {
  return h('div', { class: 'bloco medio' },
    h('h2', { class: 'titulo-final' }, comNome('Obrigado, {nome}.')),
    h('div', { class: 'risco-ouro' }),
    h('div', { class: 'texto estreito' },
      h('p', {}, 'Esta etapa não foi criada para encontrar respostas perfeitas.'),
      h('p', {}, 'Queríamos conhecer melhor como você pensa, como aprende, como resolve problemas, como utiliza autonomia, como reage diante de resultado, aquilo que deseja construir, e se aquilo que você procura combina com aquilo que estamos construindo.'),
      h('p', {}, 'Analisaremos suas respostas e entraremos em contato sobre os próximos passos.')
    ),
    h('div', { class: 'assinatura' },
      h('div', { class: 'marca-final' }, 'ATRIA'),
      h('p', {}, 'Unidade. Linguagem. Propósito.')
    ),
    h('div', { class: 'acoes' },
      h('button', { class: 'btn-discreto', onclick: baixar }, 'Baixar respostas'),
      h('button', { class: 'btn-discreto', onclick: copiar },
        copiado ? 'Copiado' : 'Copiar respostas')
    )
  );
}

/* ------------------------------------------------------------ transcrição */

function transcricao() {
  const linhas = [
    'ATRIA — Etapa de seleção',
    `Candidata: ${est.candidata}`,
    'Vaga: Suporte ao Cliente e Recuperação de Vendas',
    `Data: ${new Date().toLocaleString('pt-BR')}`,
    '',
  ];
  let numero = 0;
  for (const secao of Q.secoes) {
    const daSecao = Q.perguntas.filter((q) => q.secao === secao.id);
    if (!daSecao.length) continue;
    linhas.push(`== ${comNome(secao.titulo).toUpperCase()} ==`, '');
    for (const q of Q.perguntas) {
      if (q.secao !== secao.id) continue;
      numero = Q.perguntas.indexOf(q) + 1;
      linhas.push(`${numero}. ${comNome(q.titulo)}`);
      const r = resposta(q.id);
      if (q.tipo === 'escolha') linhas.push(`Alternativa: ${r.escolha || '—'}`);
      if (q.tipo === 'escala') {
        linhas.push(`Nota: ${r.nota !== null && r.nota !== undefined ? r.nota : '—'}/10`);
      }
      if (q.tipo === 'ordem') {
        linhas.push(`Ordem: ${(r.ordem || []).map((t, n) => `${n + 1}) ${comNome(t)}`).join(' | ')}`);
      }
      linhas.push(`Resposta: ${(r.texto || '').trim() || '—'}`, '');
    }
  }
  return linhas.join('\n');
}

function baixar() {
  const blob = new Blob([transcricao()], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `atria-selecao-${primeiroNome().toLowerCase() || 'candidata'}.txt`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

function copiar() {
  const pronto = () => {
    copiado = true;
    desenhar();
    setTimeout(() => { copiado = false; desenhar(); }, 2200);
  };
  if (navigator.clipboard?.writeText) navigator.clipboard.writeText(transcricao()).then(pronto, pronto);
  else pronto();
}

/* ----------------------------------------------------------------- envio */

async function enviar() {
  if (enviando || est.enviado) return;
  contabilizarTempo();
  enviando = true;
  erroEnvio = '';
  desenhar();

  const inicio = est.iniciadoEm ? Date.parse(est.iniciadoEm) : Date.now();

  try {
    const resposta = await fetch('/api/enviar', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        candidata: est.candidata,
        iniciadoEm: est.iniciadoEm,
        tempoTotalMs: Date.now() - inicio,
        respostas: est.respostas,
        tempos: est.tempos,
      }),
    });
    const dados = await resposta.json();
    if (!resposta.ok) throw new Error(dados.erro || 'Não foi possível enviar.');

    est.enviado = true;
    salvar();
    enviando = false;
    irPara(passos.length - 1);
  } catch (e) {
    enviando = false;
    erroEnvio = `Não conseguimos enviar suas respostas: ${e.message} Suas respostas continuam salvas neste navegador — tente novamente em instantes.`;
    desenhar();
  }
}

/* --------------------------------------------------------------- desenho */

function desenhar() {
  const p = passos[est.passo] || passos[0];
  let conteudo;
  if (p.k === 'nome') conteudo = telaNome();
  else if (p.k === 'intro') conteudo = telaEstatica(INTROS[p.indice]);
  else if (p.k === 'secao') conteudo = telaSecao(p);
  else if (p.k === 'pergunta') conteudo = telaPergunta(p);
  else if (p.k === 'revisao') conteudo = telaRevisao();
  else conteudo = telaFim();

  app.replaceChildren(
    desenharTopo(p),
    h('div', { class: 'palco' },
      h('div', { class: `tela${esmaecendo ? ' esmaecer' : ''}` }, conteudo)
    )
  );
}

function falha(mensagem) {
  app.replaceChildren(h('div', { class: 'palco' },
    h('div', { class: 'tela' },
      h('div', { class: 'bloco' },
        h('h1', { class: 'titulo-medio' }, 'Não foi possível carregar'),
        h('div', { class: 'texto' }, h('p', {}, mensagem))
      )
    )
  ));
}

async function iniciar() {
  try {
    const resposta = await fetch('/api/questionario');
    const dados = await resposta.json();
    if (!resposta.ok) throw new Error(dados.erro || 'Erro ao carregar o questionário.');
    Q = dados;
  } catch (e) {
    falha(`${e.message} Recarregue a página em alguns instantes.`);
    return;
  }

  passos = montarPassos();
  restaurar();
  entradaEm = Date.now();
  desenhar();
}

iniciar();
