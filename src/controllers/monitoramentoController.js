import mongoose from "mongoose";
import {
  listarMonitoramentos,
  buscarMonitoramento,
} from "../services/monitoramentoService.js";
export async function listar(req, res, next) {
  try {
    return res.json(await listarMonitoramentos(req.usuario.id));
  } catch (e) {
    next(e);
  }
}
export async function buscar(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ erro: "ID invalido." });
    const item = await buscarMonitoramento(req.params.id, req.usuario.id);
    return item
      ? res.json(item)
      : res.status(404).json({ erro: "Camera nao encontrada." });
  } catch (e) {
    next(e);
  }
}
