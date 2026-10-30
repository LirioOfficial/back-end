import {
  autenticarUsuario,
  cadastrarUsuario,
} from "../services/authService.js";

export async function cadastrar(req, res, next) {
  try {
    const usuario = await cadastrarUsuario(req.body);
    return res
      .status(201)
      .json({ mensagem: "Usuário cadastrado com sucesso.", usuario });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const resultado = await autenticarUsuario(req.body);
    return res.status(200).json({
      mensagem: "Login realizado com sucesso.",
      ...resultado,
    });
  } catch (error) {
    next(error);
  }
}
