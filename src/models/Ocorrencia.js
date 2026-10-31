import mongoose from "mongoose";

export const TIPOS_OCORRENCIA = ["Avistamento", "Encalhe", "Ninho", "Eclosão"];
const ocorrenciaSchema = new mongoose.Schema(
  {
    codigo: { type: String, trim: true },
    tipo: { type: String, required: true, enum: TIPOS_OCORRENCIA },
    especie: { type: String, required: true, trim: true },
    dataOcorrencia: { type: Date, required: true, default: Date.now },
    local: {
      nome: { type: String, trim: true, default: "" },
      cidade: { type: String, trim: true, default: "" },
      estado: { type: String, trim: true, default: "" },
      latitude: Number,
      longitude: Number,
    },
    situacao: { type: String, trim: true, default: "Pendente" },
    observacoes: { type: String, trim: true, default: "" },
    imagens: { type: [String], default: [] },
    tartaruga: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tartaruga",
      default: null,
    },
    criadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
      index: true,
    },
    origem: { type: String, enum: ["manual", "câmera"], default: "manual" },
  },
  { timestamps: true },
);
ocorrenciaSchema.index({ codigo: 1 }, { unique: true, sparse: true });
ocorrenciaSchema.index({ tipo: 1, especie: 1, "local.nome": 1 });
export default mongoose.model("Ocorrencia", ocorrenciaSchema);
