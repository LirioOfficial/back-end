import mongoose from "mongoose";
const schema = new mongoose.Schema({
  imagem: { type: String, required: true, trim: true },
  especieDetectada: { type: String, trim: true, default: "" },
  confianca: { type: Number, min: 0, max: 1 },
  dataDeteccao: { type: Date, default: Date.now },
  local: { type: String, trim: true, default: "" },
  monitoramento: { type: mongoose.Schema.Types.ObjectId, ref: "Monitoramento", default: null },
  statusRevisao: { type: String, enum: ["pendente", "confirmada", "descartada"], default: "pendente" },
  ocorrencia: { type: mongoose.Schema.Types.ObjectId, ref: "Ocorrencia", default: null },
  criadoPor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true, index: true },
}, { timestamps: true });
export default mongoose.model("Deteccao", schema);
