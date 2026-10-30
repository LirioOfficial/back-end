import mongoose from "mongoose";
import * as service from "../services/ocorrenciaService.js";
import { TIPOS_OCORRENCIA } from "../models/Ocorrencia.js";

const idValido = (id) => mongoose.isValidObjectId(id);
const bodyObjeto = (body) => body && typeof body === "object" && !Array.isArray(body) ? body : {};

export async function listar(req, res, next) {
  try { return res.json(await service.listarOcorrencias(req.query, req.usuario.id)); }
  catch (error) { next(error); }
}

export async function buscar(req, res, next) {
  try {
    if (!idValido(req.params.id)) return res.status(400).json({ erro: "ID inválido." });
    const item = await service.buscarOcorrencia(req.params.id, req.usuario.id);
    return item ? res.json(item) : res.status(404).json({ erro: "Ocorrência não encontrada." });
  } catch (error) { next(error); }
}

export async function criar(req, res, next) {
  try {
    const body = bodyObjeto(req.body);
    if (!TIPOS_OCORRENCIA.includes(body.tipo)) return res.status(400).json({ erro: `Tipo deve ser: ${TIPOS_OCORRENCIA.join(", ")}.` });
    if (!body.especie) return res.status(400).json({ erro: "Informe a espécie." });
    if (body.tartaruga && !idValido(body.tartaruga)) return res.status(400).json({ erro: "ID da tartaruga inválido." });
    const item = await service.criarOcorrencia(body, req.usuario.id);
    return res.status(201).json(item);
  } catch (error) { next(error); }
}

export async function atualizar(req, res, next) {
  try {
    if (!idValido(req.params.id)) return res.status(400).json({ erro: "ID inválido." });
    const permitidos = ["tipo", "especie", "dataOcorrencia", "local", "situacao", "observacoes", "imagens", "tartaruga"];
    const body = bodyObjeto(req.body);
    const dados = Object.fromEntries(Object.entries(body).filter(([chave]) => permitidos.includes(chave)));
    if (Object.keys(dados).length === 0) return res.status(400).json({ erro: "Informe ao menos um campo permitido para atualizar." });
    if (dados.tipo && !TIPOS_OCORRENCIA.includes(dados.tipo)) return res.status(400).json({ erro: "Tipo de ocorrência inválido." });
    if (dados.tartaruga && !idValido(dados.tartaruga)) return res.status(400).json({ erro: "ID da tartaruga inválido." });
    const item = await service.atualizarOcorrencia(req.params.id, dados, req.usuario.id);
    return item ? res.json(item) : res.status(404).json({ erro: "Ocorrência não encontrada." });
  } catch (error) { next(error); }
}

export async function excluir(req, res, next) {
  try {
    if (!idValido(req.params.id)) return res.status(400).json({ erro: "ID inválido." });
    const item = await service.excluirOcorrencia(req.params.id, req.usuario.id);
    return item ? res.json({ mensagem: "Ocorrência excluída." }) : res.status(404).json({ erro: "Ocorrência não encontrada." });
  } catch (error) { next(error); }
}
