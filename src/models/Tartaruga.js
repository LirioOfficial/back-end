import mongoose from "mongoose";
import { TIPOS_OCORRENCIA } from "./Ocorrencia.js";

const tartarugaSchema = new mongoose.Schema(
  {
    identificacao: { type: String, required: true, trim: true },
    especie: { type: String, required: true, trim: true },
    tipoOcorrencia: {
      type: String,
      enum: TIPOS_OCORRENCIA,
      default: "Avistamento",
    },
    dataOcorrencia: { type: Date, default: Date.now },
    sexo: { type: String, trim: true, default: "" },
    fase: { type: String, trim: true, default: "" },
    medidas: {
      comprimento: { type: Number, min: 0 },
      largura: { type: Number, min: 0 },
      peso: { type: Number, min: 0 },
    },
    local: { type: String, trim: true, default: "" },
    situacao: { type: String, required: true, trim: true },
    observacoes: { type: String, default: "" },
    fotoPrincipal: { type: String, trim: true, default: "" },
    imagem: { type: String, trim: true, default: "" },
    criadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      index: true,
    },
  },
  { timestamps: true },
);

tartarugaSchema.index({ identificacao: 1 });
export default mongoose.model("Tartaruga", tartarugaSchema);
