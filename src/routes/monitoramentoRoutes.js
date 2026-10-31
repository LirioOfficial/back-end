import { Router } from "express";
import { autenticar } from "../middlewares/autenticar.js";
import { listar, buscar } from "../controllers/monitoramentoController.js";
const r = Router();
r.use(autenticar);
r.get("/", listar);
r.get("/:id", buscar);
export default r;
