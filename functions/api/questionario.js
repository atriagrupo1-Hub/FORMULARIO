// GET /api/questionario — público. É o que a candidata carrega ao abrir o link.
import { json, erro, lerQuestionario } from '../../src/servidor.js';

export async function onRequestGet({ env }) {
  try {
    const questionario = await lerQuestionario(env);
    return json(questionario);
  } catch (e) {
    return erro(e.message, 500);
  }
}
