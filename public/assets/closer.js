// Formulário de seleção de Closer.
// Mesma mecânica do formulário original: as perguntas vêm do servidor
// (editáveis no painel), o progresso fica no navegador e só vai para o banco
// no envio. As diferenças desta vaga são três: todas as perguntas são
// obrigatórias, o candidato deixa nome, WhatsApp e e-mail, e a última pergunta
// é um áudio ou vídeo que vai para o Storage.

import { h, paragrafos } from './dom.js';
import { CAPA, INTROS, DADOS } from './aberturas-closer.js';
import { renderPergunta } from './pergunta.js';

const API = '/api/closer';
const CHAVE_LOCAL = 'atria_selecao_closer_v2';
const app = document.getElementById('app');

let Q = null;
let passos = [];
let esmaecendo = false;
let enviando = false;
let erroEnvio = '';
let revisaoAberta = true;
let copiado = false;
let entradaEm = Date.now();
let avisoFalta = '';

const est = {
  candidato: '',
  whatsapp: '',
  email: '',
  iniciadoEm: null,
  passo: 0,
  respostas: {},
  tempos: {},
  enviado: false,
};

/* ---------------------------------------------------------------- estado */

function resposta(id) {
  if (!est.respostas[id]) {
    est.respostas[id] = { texto: '', escolha: '', nota: null, ordem: [], arquivo: null };
  }
  return est.respostas[id];
}

const primeiroNome = () => (est.candidato || '').trim().split(/\s+/)[0] || '';
const comNome = (texto) => String(texto || '').split('{nome}').join(primeiroNome());

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
      candidato: d.candidato || '',
      whatsapp: d.whatsapp || '',
      email: d.email || '',
      iniciadoEm: d.iniciadoEm || null,
      respostas: d.respostas || {},
      tempos: d.tempos || {},
      passo: typeof d.passo === 'number' ? Math.min(d.passo, passos.length - 2) : 0,
    });
  } catch {
    /* dado corrompido: começa do zero */
  }
}

/* ------------------------------------------------------- o que está faltando */

/** Nesta vaga nada pode ficar em branco. Devolve '' quando a pergunta está ok. */
function faltaEm(q) {
  const r = resposta(q.id);
  if (q.tipo === 'upload') {
    return r.arquivo && r.arquivo.url ? '' : 'Envie o áudio ou vídeo para continuar.';
  }
  return (r.texto || '').trim() ? '' : 'Responda esta pergunta para continuar.';
}

const perguntasFaltando = () => Q.perguntas.filter((q) => q.obrigatoria && faltaEm(q));

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

document.addEventListener('visibilitychange', () => {
  if (document.hidden) contabilizarTempo();
  else entradaEm = Date.now();
});

/* ---------------------------------------------------------------- navegação */

function montarPassos() {
  const lista = [{ k: 'capa' }];
  INTROS.forEach((_, indice) => lista.push({ k: 'intro', indice }));
  lista.push({ k: 'dados' });

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
  avisoFalta = '';
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

/** Só deixa avançar quando a pergunta da tela está respondida. */
function proximo() {
  const atual = passos[est.passo];
  if (atual && atual.k === 'pergunta' && atual.pergunta.obrigatoria) {
    const falta = faltaEm(atual.pergunta);
    if (falta) {
      avisoFalta = falta;
      desenhar();
      return;
    }
  }
  irPara(est.passo + 1);
}

const anterior = () => irPara(est.passo - 1);

/* ------------------------------------------------------------------ topo */

function rotuloEtapa(p) {
  if (p.k === 'secao') return `Seção ${p.numero}`;
  if (p.k === 'pergunta') return `${p.numero} de ${Q.perguntas.length}`;
  if (p.k === 'revisao') return 'Revisão';
  if (p.k === 'fim') return 'Concluído';
  return 'Apresentação';
}

const ordemDaSecao = (id) => Q.secoes.findIndex((s) => s.id === id);

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
      h('button', { class: 'btn-topo', onclick: () => irPara(0) }, 'Início')
    )
  );
}

/* --------------------------------------------------------------- telas */

function telaEstatica(html) {
  const caixa = document.createElement('div');
  caixa.innerHTML = html;
  caixa.querySelectorAll('[data-acao=proximo]').forEach((b) =>
    b.addEventListener('click', () => irPara(est.passo + 1)));
  caixa.querySelectorAll('[data-acao=anterior]').forEach((b) =>
    b.addEventListener('click', anterior));
  return caixa.firstElementChild;
}

function telaDados() {
  const no = telaEstatica(DADOS);
  const nome = no.querySelector('#campo-nome');
  const zap = no.querySelector('#campo-whatsapp');
  const email = no.querySelector('#campo-email');
  const aviso = no.querySelector('#erro-dados');
  const botao = no.querySelector('[data-acao=comecar]');

  nome.value = est.candidato;
  zap.value = est.whatsapp;
  email.value = est.email;

  const guardar = () => {
    est.candidato = nome.value.trim();
    est.whatsapp = zap.value.trim();
    est.email = email.value.trim();
    salvar();
  };
  [nome, zap, email].forEach((c) => c.addEventListener('input', guardar));

  const seguir = () => {
    guardar();
    let problema = '';
    let foco = null;
    if (!est.candidato) { problema = 'Escreva seu nome completo.'; foco = nome; }
    else if (!est.whatsapp) { problema = 'Informe seu WhatsApp.'; foco = zap; }
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(est.email)) {
      problema = 'Informe um e-mail válido.'; foco = email;
    }
    if (problema) {
      aviso.textContent = problema;
      aviso.hidden = false;
      foco.focus();
      return;
    }
    aviso.hidden = true;
    if (!est.iniciadoEm) est.iniciadoEm = new Date().toISOString();
    salvar();
    irPara(est.passo + 1);
  };

  [nome, zap, email].forEach((c) => c.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); seguir(); }
  }));
  botao.addEventListener('click', seguir);
  setTimeout(() => nome.focus(), 60);
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

/* -------------------------------------------------- envio de áudio ou vídeo */

const LIMITE_MB = 500;
let gravador = null;
let pedacos = [];
let gravandoDesde = 0;
let relogio = null;
let enviandoArquivo = false;
let progressoEnvio = 0;
let erroArquivo = '';

const pesoEmMB = (bytes) => (bytes / 1048576).toFixed(1);

function pararRelogio() {
  if (relogio) { clearInterval(relogio); relogio = null; }
}

/** Manda o arquivo direto para o Storage, usando a URL assinada pelo servidor. */
async function enviarArquivo(blob, nomeArquivo, r) {
  erroArquivo = '';
  if (blob.size > LIMITE_MB * 1048576) {
    erroArquivo = `O arquivo tem ${pesoEmMB(blob.size)} MB e o limite é ${LIMITE_MB} MB. Grave um trecho mais curto.`;
    desenhar();
    return;
  }
  enviandoArquivo = true;
  progressoEnvio = 0;
  desenhar();
  try {
    const pedido = await fetch(`${API}/upload`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ nome: nomeArquivo, tipo: blob.type, tamanho: blob.size }),
    });
    const dados = await pedido.json();
    if (!pedido.ok) throw new Error(dados.erro || 'Não foi possível preparar o envio.');

    await new Promise((resolver, recusar) => {
      const req = new XMLHttpRequest();
      req.open('PUT', dados.envio, true);
      req.setRequestHeader('content-type', blob.type || 'application/octet-stream');
      req.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          progressoEnvio = Math.round((e.loaded / e.total) * 100);
          desenhar();
        }
      };
      req.onload = () => (req.status >= 200 && req.status < 300
        ? resolver()
        : recusar(new Error(`O servidor de arquivos respondeu ${req.status}.`)));
      req.onerror = () => recusar(new Error('A conexão caiu durante o envio.'));
      req.send(blob);
    });

    r.arquivo = {
      url: dados.publico,
      nome: nomeArquivo,
      tipo: blob.type || '',
      tamanho: blob.size,
    };
    salvar();
  } catch (e) {
    erroArquivo = `${e.message} Tente novamente.`;
  } finally {
    enviandoArquivo = false;
    progressoEnvio = 0;
    desenhar();
  }
}

async function comecarGravacao(r) {
  erroArquivo = '';
  try {
    const trilha = await navigator.mediaDevices.getUserMedia({ audio: true });
    pedacos = [];
    gravador = new MediaRecorder(trilha);
    gravador.ondataavailable = (e) => { if (e.data.size) pedacos.push(e.data); };
    gravador.onstop = () => {
      trilha.getTracks().forEach((t) => t.stop());
      pararRelogio();
      const tipo = gravador.mimeType || 'audio/webm';
      const blob = new Blob(pedacos, { type: tipo });
      gravador = null;
      const extensao = tipo.includes('mp4') ? 'm4a' : 'webm';
      enviarArquivo(blob, `gravacao-${primeiroNome().toLowerCase() || 'candidato'}.${extensao}`, r);
    };
    gravador.start();
    gravandoDesde = Date.now();
    relogio = setInterval(() => {
      // Cinco minutos é o teto do enunciado; para sozinho ao chegar lá.
      if (Date.now() - gravandoDesde >= 5 * 60 * 1000) pararGravacao();
      else desenhar();
    }, 500);
    desenhar();
  } catch {
    erroArquivo = 'Não conseguimos acessar seu microfone. Libere o acesso no navegador ou envie um arquivo do seu aparelho.';
    desenhar();
  }
}

function pararGravacao() {
  if (gravador && gravador.state !== 'inactive') gravador.stop();
  pararRelogio();
}

function relogioTexto() {
  const s = Math.floor((Date.now() - gravandoDesde) / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

function montarEnvio(caixa, r) {
  const filhos = [];

  if (gravador) {
    filhos.push(h('div', { class: 'envio-area ativo' },
      h('div', { class: 'envio-gravando' },
        h('span', { class: 'envio-ponto' }),
        h('span', {}, `Gravando — ${relogioTexto()}`)
      ),
      h('p', { class: 'envio-dica' }, 'O limite é de 5 minutos. A gravação para sozinha ao chegar lá.'),
      h('div', { class: 'envio-botoes' },
        h('button', { class: 'btn-ouro', onclick: pararGravacao }, 'Parar e enviar')
      )
    ));
  } else if (enviandoArquivo) {
    const barra = h('span', {});
    barra.style.width = `${progressoEnvio}%`;
    filhos.push(h('div', { class: 'envio-area ativo' },
      h('div', { class: 'envio-gravando' }, h('span', { class: 'girando' }), h('span', {}, `Enviando — ${progressoEnvio}%`)),
      h('div', { class: 'envio-trilho' }, barra),
      h('p', { class: 'envio-dica' }, 'Não feche esta tela até terminar.')
    ));
  } else if (r.arquivo && r.arquivo.url) {
    const ehVideo = (r.arquivo.tipo || '').startsWith('video/');
    const tocador = h(ehVideo ? 'video' : 'audio', { src: r.arquivo.url, controls: true });
    filhos.push(h('div', { class: 'envio-area ativo' },
      h('div', { class: 'envio-arquivo' },
        h('span', { class: 'nome' }, r.arquivo.nome || 'arquivo enviado'),
        h('span', { class: 'peso' }, `${pesoEmMB(r.arquivo.tamanho || 0)} MB`)
      ),
      tocador,
      h('div', { class: 'envio-botoes' },
        h('button', {
          class: 'btn-contorno',
          onclick: () => { r.arquivo = null; salvar(); desenhar(); },
        }, 'Enviar outro')
      )
    ));
  } else {
    const seletor = h('input', { type: 'file', accept: 'audio/*,video/*' });
    seletor.style.display = 'none';
    seletor.addEventListener('change', (e) => {
      const f = e.target.files && e.target.files[0];
      if (f) enviarArquivo(f, f.name, r);
    });
    filhos.push(h('div', { class: 'envio-area' },
      h('p', { class: 'envio-dica' }, 'Grave aqui mesmo pelo navegador ou envie um arquivo que já esteja no seu aparelho. Áudio ou vídeo, até 5 minutos.'),
      h('div', { class: 'envio-botoes' },
        h('button', { class: 'btn-ouro', onclick: () => comecarGravacao(r) }, 'Gravar áudio agora'),
        h('button', { class: 'btn-contorno', onclick: () => seletor.click() }, 'Escolher arquivo')
      ),
      seletor
    ));
  }

  if (erroArquivo) filhos.push(h('p', { class: 'envio-erro' }, erroArquivo));
  caixa.replaceChildren(...filhos.filter(Boolean));
}

/* --------------------------------------------------------------- perguntas */

function telaPergunta(p) {
  const q = p.pergunta;
  const r = resposta(q.id);

  const { partes, area, caixaEnvio } = renderPergunta({
    pergunta: q,
    numero: p.numero,
    tituloSecao: tituloSecao(q.secao),
    resposta: r,
    comNome,
    aoAtualizar: () => { salvar(); desenhar(); },
  });

  if (caixaEnvio) montarEnvio(caixaEnvio, r);

  if (area) {
    area.addEventListener('input', (e) => {
      r.texto = e.target.value;
      if (avisoFalta && r.texto.trim()) { avisoFalta = ''; desenhar(); }
      salvar();
    });
    area.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); proximo(); }
    });
  }

  if (avisoFalta) partes.push(h('p', { class: 'envio-erro' }, avisoFalta));

  partes.push(h('div', { class: 'acoes' },
    h('button', { class: 'btn-ouro seguir', onclick: proximo }, 'Continuar →'),
    h('button', { class: 'btn-voltar', onclick: anterior }, '← Voltar'),
    h('span', { class: 'aviso-salvo' }, 'Progresso salvo automaticamente')
  ));

  if (area) setTimeout(() => { try { area.focus({ preventScroll: true }); } catch { /* noop */ } }, 60);
  return h('div', { class: 'bloco junto' }, ...partes);
}

/* ---------------------------------------------------------------- revisão */

function resumoResposta(q) {
  const r = resposta(q.id);
  if (q.tipo === 'upload') {
    return r.arquivo && r.arquivo.url
      ? `Arquivo enviado: ${r.arquivo.nome} (${pesoEmMB(r.arquivo.tamanho || 0)} MB)`
      : 'Nenhum arquivo enviado';
  }
  return (r.texto || '').trim() || 'Sem resposta';
}

function telaRevisao() {
  const faltando = perguntasFaltando();

  const itens = Q.perguntas.map((q, i) => {
    const indice = passos.findIndex((s) => s.k === 'pergunta' && s.pergunta.id === q.id);
    const vazia = !!faltaEm(q);
    return h('div', { class: 'revisao-item' },
      h('div', { class: 'revisao-cabecalho' },
        h('div', { class: 'revisao-titulo' }, `${i + 1}. ${comNome(q.titulo)}`),
        h('button', { class: 'revisao-editar', onclick: () => irPara(indice) }, 'Editar')
      ),
      h('div', { class: `revisao-resposta${vazia ? ' faltando' : ''}` }, resumoResposta(q))
    );
  });

  return h('div', { class: 'bloco medio' },
    h('h2', { class: 'titulo-final' }, comNome(faltando.length ? 'Quase lá, {nome}.' : 'Pronto, {nome}.')),
    h('p', { class: 'revisao-intro' },
      faltando.length
        ? `Ainda ${faltando.length === 1 ? 'falta 1 pergunta' : `faltam ${faltando.length} perguntas`}. Todas são obrigatórias — clique em "Editar" para completar.`
        : 'Suas respostas estão completas. Você pode revisar antes de enviar.'),
    revisaoAberta ? h('div', { class: 'revisao' }, ...itens) : null,
    erroEnvio ? h('p', { class: 'erro-envio' }, erroEnvio) : null,
    h('div', { class: 'acoes solta' },
      h('button', {
        class: 'btn-ouro enviar',
        disabled: enviando || faltando.length > 0,
        onclick: enviar,
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
      h('p', {}, 'Queríamos entender como você vende: como conduz uma conversa, como diagnostica o cenário de quem está do outro lado, como trabalha objeções e como enxerga seus próprios números.'),
      h('p', {}, 'Analisaremos suas respostas e entraremos em contato sobre os próximos passos.')
    ),
    h('div', { class: 'assinatura' },
      h('div', { class: 'marca-final' }, 'ATRIA'),
      h('p', {}, 'Unidade. Linguagem. Propósito.')
    ),
    h('div', { class: 'acoes' },
      h('button', { class: 'btn-discreto', onclick: baixar }, 'Baixar respostas'),
      h('button', { class: 'btn-discreto', onclick: copiar }, copiado ? 'Copiado' : 'Copiar respostas')
    )
  );
}

/* ------------------------------------------------------------ transcrição */

function transcricao() {
  const linhas = [
    'ATRIA — Processo seletivo: Closer',
    `Candidato: ${est.candidato}`,
    `WhatsApp: ${est.whatsapp || '—'}`,
    `E-mail: ${est.email || '—'}`,
    `Data: ${new Date().toLocaleString('pt-BR')}`,
    '',
  ];
  for (const secao of Q.secoes) {
    if (!Q.perguntas.some((q) => q.secao === secao.id)) continue;
    linhas.push(`== ${comNome(secao.titulo).toUpperCase()} ==`, '');
    for (const q of Q.perguntas) {
      if (q.secao !== secao.id) continue;
      linhas.push(`${Q.perguntas.indexOf(q) + 1}. ${comNome(q.titulo)}`);
      linhas.push(`Resposta: ${resumoResposta(q)}`, '');
    }
  }
  return linhas.join('\n');
}

function baixar() {
  const blob = new Blob([transcricao()], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `atria-closer-${primeiroNome().toLowerCase() || 'candidato'}.txt`;
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
  if (perguntasFaltando().length) { desenhar(); return; }
  contabilizarTempo();
  enviando = true;
  erroEnvio = '';
  desenhar();

  const inicio = est.iniciadoEm ? Date.parse(est.iniciadoEm) : Date.now();

  try {
    const resposta = await fetch(`${API}/enviar`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        candidato: est.candidato,
        whatsapp: est.whatsapp,
        email: est.email,
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
  if (p.k === 'capa') conteudo = telaEstatica(CAPA);
  else if (p.k === 'intro') conteudo = telaEstatica(INTROS[p.indice]);
  else if (p.k === 'dados') conteudo = telaDados();
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
    const resposta = await fetch(`${API}/questionario`);
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
