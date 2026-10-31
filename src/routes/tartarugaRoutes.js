import { Router } from "express";
import { autenticar } from "../middlewares/autenticar.js";
import {
  listar,
  buscarPorId,
  criar,
  atualizar,
  excluir,
} from "../controllers/tartarugaController.js";

const router = Router();
// Todas as operações de tartarugas exigem token JWT.
router.use(autenticar);
router.get("/", listar);
router.get("/:id", buscarPorId);
router.post("/", criar);
router.put("/:id", atualizar);
router.patch("/:id", atualizar);
router.delete("/:id", excluir);
export default router;
