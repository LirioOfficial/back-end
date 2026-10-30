import { obterPerfil, atualizarPerfil } from "../services/usuarioService.js";
export async function me(req, res, next) { try { const usuario = await obterPerfil(req.usuario.id); return usuario ? res.json({ usuario }) : res.status(404).json({ erro: "Usuário não encontrado." }); } catch (e) { next(e); } }
export async function atualizarMe(req, res, next) { try { const usuario = await atualizarPerfil(req.usuario.id, req.body); return usuario ? res.json({ usuario }) : res.status(404).json({ erro: "Usuário não encontrado." }); } catch (e) { next(e); } }
