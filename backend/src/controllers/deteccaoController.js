import mongoose from "mongoose";import * as s from "../services/deteccaoService.js";
export async function listar(req,res,next){try{return res.json(await s.listarDeteccoes(req.usuario.id));}catch(e){next(e);}}
export async function buscar(req,res,next){try{if(!mongoose.isValidObjectId(req.params.id))return res.status(400).json({erro:"ID inválido."});const x=await s.buscarDeteccao(req.params.id,req.usuario.id);return x?res.json(x):res.status(404).json({erro:"Detecção não encontrada."});}catch(e){next(e);}}
