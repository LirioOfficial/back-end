import Deteccao from "../models/Deteccao.js";
export const listarDeteccoes = (usuarioId) => Deteccao.find({ criadoPor: usuarioId }).sort({ dataDeteccao: -1 }).limit(100);
export const buscarDeteccao = (id, usuarioId) => Deteccao.findOne({ _id: id, criadoPor: usuarioId });
