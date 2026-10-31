import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema(
  {
    nome: { type: String, trim: true, default: "" },
    email: {
      type: String,
      required: [true, "O e-mail é obrigatório."],
      unique: true,
      trim: true,
      lowercase: true,
    },
    senha: {
      type: String,
      required: [true, "A senha é obrigatória."],
      select: false,
    },
    fotoPerfil: { type: String, trim: true, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model("Usuario", usuarioSchema);
