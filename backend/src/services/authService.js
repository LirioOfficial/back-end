import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";
import { emailValido, normalizarEmail } from "../utils/email.js";

function gerarToken(usuario) {
  if (!process.env.JWT_SECRET)
    throw new Error("JWT_SECRET não foi configurada no .env.");
  return jwt.sign({ sub: usuario.id }, process.env.JWT_SECRET, {
    expiresIn: "8h",
  });
}

export async function cadastrarUsuario({ nome = "", email, senha }) {
  if (typeof email !== "string" || typeof senha !== "string" || !email.trim() || !senha) {
    const error = new Error("Informe e-mail e senha.");
    error.status = 400;
    throw error;
  }
  const emailNormalizado = normalizarEmail(email);
  if (!emailValido(emailNormalizado)) {
    const error = new Error("Informe um e-mail válido."); error.status = 400; throw error;
  }
  if (senha.length < 8) { const error = new Error("A senha deve ter ao menos 8 caracteres."); error.status = 400; throw error; }
  const existente = await Usuario.findOne({ email: emailNormalizado });
  if (existente) {
    const error = new Error("Já existe um usuário cadastrado com este e-mail.");
    error.status = 409;
    throw error;
  }
  const senhaHash = await bcrypt.hash(senha, 10);
  const usuario = await Usuario.create({
    nome: typeof nome === "string" ? nome.trim() : "",
    email: emailNormalizado,
    senha: senhaHash,
  });
  return { id: usuario.id, nome: usuario.nome, email: usuario.email, fotoPerfil: usuario.fotoPerfil };
}

export async function autenticarUsuario({ email, senha }) {
  if (typeof email !== "string" || typeof senha !== "string" || !email.trim() || !senha) {
    const error = new Error("Informe e-mail e senha.");
    error.status = 400;
    throw error;
  }
  const usuario = await Usuario.findOne({
    email: email.trim().toLowerCase(),
  }).select("+senha");
  const senhaValida = usuario && (await bcrypt.compare(senha, usuario.senha));
  if (!senhaValida) {
    const error = new Error("E-mail ou senha inválidos.");
    error.status = 401;
    throw error;
  }
  return {
    usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, fotoPerfil: usuario.fotoPerfil },
    token: gerarToken(usuario),
  };
}
