import { listarMonitoramentos } from "../services/monitoramentoService.js";
export async function listar(req,res,next){try{return res.json(await listarMonitoramentos(req.usuario.id));}catch(e){next(e);}}
