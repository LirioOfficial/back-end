import mongoose from "mongoose";

const tartarugaSchema = new mongoose.Schema(
  {
    identificacao: { type: String, required: true, trim: true },
    especie: { type: String, required: true, trim: true },
    local: { type: String, trim: true, default: "" },
    situacao: { type: String, required: true, trim: true },
    observacoes: { type: String, default: "" },
    fotoPrincipal: { type: String, trim: true, default: "" },
    imagem: { type: String, trim: true, default: "" },
    criadoPor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", index: true },
  },
  { timestamps: true },
);

tartarugaSchema.index({ identificacao: 1 });
export default mongoose.model("Tartaruga", tartarugaSchema);
