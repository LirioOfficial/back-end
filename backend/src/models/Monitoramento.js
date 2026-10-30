import mongoose from "mongoose";
const schema = new mongoose.Schema({
  identificacao: { type: String, required: true, trim: true },
  nome: { type: String, required: true, trim: true },
  local: { type: String, trim: true, default: "" },
  cidade: { type: String, trim: true, default: "" },
  estado: { type: String, trim: true, default: "" },
  latitude: Number, longitude: Number,
  estadoConexao: { type: String, enum: ["conectada", "desconectada", "instável"], default: "desconectada" },
  ultimaAtualizacao: Date,
  imagemAtual: { type: String, trim: true, default: "" },
  criadoPor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true, index: true },
}, { timestamps: true });
schema.index({ identificacao: 1, criadoPor: 1 }, { unique: true });
export default mongoose.model("Monitoramento", schema);
