import mongoose from "mongoose";
import * as service from "../services/tartarugaService.js";
import { TIPOS_OCORRENCIA } from "../models/Ocorrencia.js";

const idValido = (id) => mongoose.isValidObjectId(id);

export async function listar(req, res, next) {
  try {
    return res.json(await service.listarTartarugas(req.usuario.id));
  } catch (error) {
    next(error);
  }
}

export async function buscarPorId(req, res, next) {
  try {
    if (!idValido(req.params.id))
      return res.status(400).json({ erro: "ID inválido." });
    const item = await service.buscarTartarugaPorId(
      req.params.id,
      req.usuario.id,
    );
    return item
      ? res.json(item)
      : res.status(404).json({ erro: "Tartaruga não encontrada." });
  } catch (error) {
    next(error);
  }
}

export async function criar(req, res, next) {
  try {
    const body =
      req.body && typeof req.body === "object" && !Array.isArray(req.body)
        ? req.body
        : {};
    const {
      identificacao,
      especie,
      local,
      situacao,
      observacoes,
      imagem,
      fotoPrincipal,
      tipoOcorrencia,
      dataOcorrencia,
      sexo,
      fase,
      medidas,
    } = body;
    if (!identificacao || !especie || !situacao)
      return res
        .status(400)
        .json({ erro: "Informe identificação, espécie e situação." });
    if (tipoOcorrencia && !TIPOS_OCORRENCIA.includes(tipoOcorrencia))
      return res.status(400).json({ erro: "Tipo de ocorrencia invalido." });
    const item = await service.criarTartaruga(
      {
        identificacao,
        especie,
        local,
        situacao,
        observacoes,
        imagem,
        fotoPrincipal: fotoPrincipal ?? imagem,
        tipoOcorrencia,
        dataOcorrencia,
        sexo,
        fase,
        medidas,
      },
      req.usuario.id,
    );
    return res.status(201).json(item);
  } catch (error) {
    next(error);
  }
}

export async function atualizar(req, res, next) {
  try {
    if (!idValido(req.params.id))
      return res.status(400).json({ erro: "ID inválido." });
    const permitidos = [
      "identificacao",
      "especie",
      "tipoOcorrencia",
      "dataOcorrencia",
      "sexo",
      "fase",
      "medidas",
      "local",
      "situacao",
      "observacoes",
      "imagem",
      "fotoPrincipal",
    ];
    const body =
      req.body && typeof req.body === "object" && !Array.isArray(req.body)
        ? req.body
        : {};
    const dados = Object.fromEntries(
      Object.entries(body).filter(([chave]) => permitidos.includes(chave)),
    );
    if (Object.keys(dados).length === 0)
      return res
        .status(400)
        .json({ erro: "Informe ao menos um campo permitido para atualizar." });
    if (
      dados.tipoOcorrencia &&
      !TIPOS_OCORRENCIA.includes(dados.tipoOcorrencia)
    )
      return res.status(400).json({ erro: "Tipo de ocorrencia invalido." });
    if (dados.fotoPrincipal === undefined && dados.imagem !== undefined)
      dados.fotoPrincipal = dados.imagem;
    const item = await service.atualizarTartaruga(
      req.params.id,
      dados,
      req.usuario.id,
    );
    return item
      ? res.json(item)
      : res.status(404).json({ erro: "Tartaruga não encontrada." });
  } catch (error) {
    next(error);
  }
}

export async function excluir(req, res, next) {
  try {
    if (!idValido(req.params.id))
      return res.status(400).json({ erro: "ID inválido." });
    const item = await service.excluirTartaruga(req.params.id, req.usuario.id);
    return item
      ? res.json({ mensagem: "Tartaruga excluída com sucesso." })
      : res.status(404).json({ erro: "Tartaruga não encontrada." });
  } catch (error) {
    next(error);
  }
}
