import Tartaruga from "../models/Tartaruga.js";

export async function listarTartarugas(usuarioId) {
  return Tartaruga.find({ criadoPor: usuarioId }).sort({ createdAt: -1 });
}

export async function buscarTartarugaPorId(id, usuarioId) {
  return Tartaruga.findOne({ _id: id, criadoPor: usuarioId });
}

export async function criarTartaruga(dados, usuarioId) {
  return Tartaruga.create({ ...dados, criadoPor: usuarioId });
}

export async function atualizarTartaruga(id, dados, usuarioId) {
  return Tartaruga.findOneAndUpdate({ _id: id, criadoPor: usuarioId }, dados, {
    new: true,
    runValidators: true,
  });
}

export async function excluirTartaruga(id, usuarioId) {
  return Tartaruga.findOneAndDelete({ _id: id, criadoPor: usuarioId });
}
