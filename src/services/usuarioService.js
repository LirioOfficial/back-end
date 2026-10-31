import Usuario from "../models/Usuario.js";
import { emailValido, normalizarEmail } from "../utils/email.js";
export async function obterPerfil(id) {
  return Usuario.findById(id).select(
    "nome email fotoPerfil createdAt updatedAt",
  );
}
export async function atualizarPerfil(id, dados) {
  const permitidos = Object.fromEntries(
    Object.entries(dados).filter(([k]) =>
      ["nome", "email", "fotoPerfil"].includes(k),
    ),
  );
  if (Object.hasOwn(permitidos, "email")) {
    if (typeof permitidos.email !== "string") {
      const error = new Error("Informe um e-mail válido.");
      error.status = 400;
      throw error;
    }
    permitidos.email = normalizarEmail(permitidos.email);
    if (!emailValido(permitidos.email)) {
      const error = new Error("Informe um e-mail válido.");
      error.status = 400;
      throw error;
    }
  }
  return Usuario.findByIdAndUpdate(id, permitidos, {
    new: true,
    runValidators: true,
    select: "nome email fotoPerfil createdAt updatedAt",
  });
}
