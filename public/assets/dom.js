// Construtor de elementos minúsculo, usado pelo formulário e pelo painel.
// Texto sempre entra como nó de texto, então conteúdo editável no painel
// nunca é interpretado como HTML.

export function h(tag, atributos, ...filhos) {
  const el = document.createElement(tag);
  for (const [chave, valor] of Object.entries(atributos || {})) {
    if (valor === null || valor === undefined || valor === false) continue;
    if (chave === 'class') el.className = valor;
    else if (chave === 'onclick') el.addEventListener('click', valor);
    else if (chave === 'oninput') el.addEventListener('input', valor);
    else if (chave === 'onchange') el.addEventListener('change', valor);
    else if (chave === 'onkeydown') el.addEventListener('keydown', valor);
    else if (chave === 'valor') el.value = valor;
    else el.setAttribute(chave, valor === true ? '' : valor);
  }
  for (const filho of filhos.flat(Infinity)) {
    if (filho === null || filho === undefined || filho === false) continue;
    el.appendChild(filho instanceof Node ? filho : document.createTextNode(String(filho)));
  }
  return el;
}

/** Parágrafos a partir de uma lista de linhas. */
export function paragrafos(linhas, classe) {
  return (linhas || []).map((linha) => h('p', classe ? { class: classe } : {}, linha));
}

export function minutos(ms) {
  if (!Number.isFinite(ms) || ms < 0) return '—';
  const total = Math.round(ms / 1000);
  const horas = Math.floor(total / 3600);
  const min = Math.floor((total % 3600) / 60);
  const seg = total % 60;
  if (horas) return `${horas}h ${String(min).padStart(2, '0')}min`;
  if (min) return `${min}min ${String(seg).padStart(2, '0')}s`;
  return `${seg}s`;
}

export function dataHora(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString('pt-BR');
}
