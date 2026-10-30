import { Router } from "express";
import * as c from "../controllers/ocorrenciaController.js";
import { autenticar } from "../middlewares/autenticar.js";
const router=Router();router.use(autenticar);router.get("/",c.listar);router.get("/:id",c.buscar);router.post("/",c.criar);router.patch("/:id",c.atualizar);router.delete("/:id",c.excluir);export default router;
