import Monitoramento from "../models/Monitoramento.js";
export const listarMonitoramentos = (usuarioId) => Monitoramento.find({ criadoPor: usuarioId }).sort({ nome: 1 });
