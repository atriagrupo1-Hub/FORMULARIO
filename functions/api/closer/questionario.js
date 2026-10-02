// GET /api/closer/questionario — público. É o que o candidato carrega ao abrir o link.
import { json, erro, lerQuestionario } from '../../../src/servidor.js';

export async function onRequestGet({ env }) {
  try {
    return json(await lerQuestionario(env, 'closer'));
  } catch (e) {
    return erro(e.message, 500);
  }
}
