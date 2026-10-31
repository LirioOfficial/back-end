import Monitoramento from "../models/Monitoramento.js";
export const listarMonitoramentos = (usuarioId) =>
  Monitoramento.find({ criadoPor: usuarioId }).sort({ nome: 1 });
export const buscarMonitoramento = (id, usuarioId) =>
  Monitoramento.findOne({ _id: id, criadoPor: usuarioId });
