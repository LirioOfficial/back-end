import { Router } from "express";
import { autenticar } from "../middlewares/autenticar.js";
import { analisarImagem } from "../services/imageAnalysisService.js";

const router = Router();

router.post("/analisar", autenticar, async (req, res, next) => {
  try {
    const resultado = await analisarImagem(req.body?.imagem);
    return res.json(resultado);
  } catch (error) {
    return next(error);
  }
});

export default router;
