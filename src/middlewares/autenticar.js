import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

export async function autenticar(req, res, next) {
  try {
    const cabecalho = req.headers.authorization;
    if (!cabecalho?.startsWith("Bearer ")) {
      return res.status(401).json({ erro: "Token de acesso não informado." });
    }
    if (!process.env.JWT_SECRET)
      throw new Error("JWT_SECRET não foi configurada no .env.");
    const token = cabecalho.slice(7);
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findById(payload.sub).select("_id email");
    if (!usuario)
      return res.status(401).json({ erro: "Usuário do token não encontrado." });
    req.usuario = usuario;
    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({ erro: "Token inválido ou expirado." });
    }
    next(error);
  }
}
