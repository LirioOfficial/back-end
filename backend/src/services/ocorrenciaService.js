import Ocorrencia from "../models/Ocorrencia.js";
import Tartaruga from "../models/Tartaruga.js";
const erro = (m, s=400) => Object.assign(new Error(m), { status: s });
function filtro(query, usuarioId) {
  const f = { criadoPor: usuarioId };
  if (query.tipo) f.tipo = query.tipo;
  if (query.busca) { const re = new RegExp(String(query.busca).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"); f.$or = [{ codigo: re }, { especie: re }, { "local.nome": re }, { "local.cidade": re }]; }
  return f;
}
export async function listarOcorrencias(query, usuarioId) {
 const page = Math.max(1, Number.parseInt(query.page, 10) || 1); const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit, 10) || 20)); const f = filtro(query, usuarioId);
 const [items,total] = await Promise.all([Ocorrencia.find(f).sort({ dataOcorrencia: -1 }).skip((page-1)*limit).limit(limit).populate("tartaruga", "identificacao especie"), Ocorrencia.countDocuments(f)]);
 return { items, pagination: { page, limit, total, pages: Math.ceil(total/limit) } };
}
export const buscarOcorrencia = (id, usuarioId) => Ocorrencia.findOne({ _id:id, criadoPor:usuarioId }).populate("tartaruga", "identificacao especie");
export async function criarOcorrencia(dados, usuarioId) {
 if (dados.tartaruga && !(await Tartaruga.exists({ _id: dados.tartaruga, criadoPor: usuarioId }))) throw erro("Tartaruga vinculada não encontrada.", 404);
 const codigo = dados.codigo?.trim() || `OC-${Date.now().toString(36).toUpperCase()}`;
 return Ocorrencia.create({ ...dados, codigo, criadoPor: usuarioId, origem: "manual" });
}
export async function atualizarOcorrencia(id, dados, usuarioId) {
 if (dados.tartaruga && !(await Tartaruga.exists({ _id: dados.tartaruga, criadoPor: usuarioId }))) throw erro("Tartaruga vinculada não encontrada.", 404);
 return Ocorrencia.findOneAndUpdate(
  { _id: id, criadoPor: usuarioId },
  { $set: dados },
  { returnDocument: "after", runValidators: true },
 );
}
export const excluirOcorrencia = (id, usuarioId) => Ocorrencia.findOneAndDelete({ _id:id, criadoPor:usuarioId });
export { erro };
