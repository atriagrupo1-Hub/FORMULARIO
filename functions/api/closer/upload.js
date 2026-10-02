// POST /api/closer/upload — público. Devolve uma URL assinada para o navegador
// mandar o áudio ou vídeo direto ao Supabase Storage.
//
// O arquivo não passa por aqui de propósito: um vídeo de cinco minutos pode ter
// dezenas de megabytes, e o corpo de uma função do Cloudflare é limitado. Assim
// o navegador fala direto com o Storage, usando uma permissão temporária que
// este servidor assina com a chave service_role.
import { json, erro, assinarEnvio, vaga } from '../../../src/servidor.js';

const LIMITE_BYTES = 500 * 1024 * 1024; // 500 MB, o mesmo do balde

const EXTENSOES = {
  'audio/mpeg': 'mp3',
  'audio/mp4': 'm4a',
  'audio/x-m4a': 'm4a',
  'audio/aac': 'aac',
  'audio/ogg': 'ogg',
  'audio/wav': 'wav',
  'audio/x-wav': 'wav',
  'audio/webm': 'webm',
  'video/mp4': 'mp4',
  'video/quicktime': 'mov',
  'video/webm': 'webm',
  'video/x-matroska': 'mkv',
};

/** Só deixa passar o que dá para ouvir ou assistir no painel. */
function extensaoDe(tipo, nome) {
  const limpo = String(tipo || '').toLowerCase().split(';')[0].trim();
  if (EXTENSOES[limpo]) return EXTENSOES[limpo];
  if (limpo.startsWith('audio/') || limpo.startsWith('video/')) {
    const fim = String(nome || '').toLowerCase().match(/\.([a-z0-9]{1,5})$/);
    if (fim) return fim[1];
    return limpo.startsWith('audio/') ? 'audio' : 'video';
  }
  return '';
}

export async function onRequestPost({ request, env }) {
  try {
    const corpo = await request.json().catch(() => ({}));

    const tamanho = Number(corpo.tamanho);
    if (!Number.isFinite(tamanho) || tamanho <= 0) {
      return erro('Não deu para ler o tamanho do arquivo.', 400);
    }
    if (tamanho > LIMITE_BYTES) {
      return erro('O arquivo passa de 500 MB. Grave um trecho mais curto ou com menos qualidade.', 413);
    }

    const extensao = extensaoDe(corpo.tipo, corpo.nome);
    if (!extensao) {
      return erro('Envie um arquivo de áudio ou de vídeo.', 415);
    }

    // Nome sorteado: o balde é público, então o endereço não pode ser adivinhável
    // a partir do nome do candidato.
    const caminho = `${crypto.randomUUID()}.${extensao}`;
    const { envio, publico } = await assinarEnvio(env, vaga('closer').balde, caminho);

    return json({ envio, publico, caminho });
  } catch (e) {
    return erro(e.message, 500);
  }
}
