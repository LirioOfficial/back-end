import { Router } from "express";
import { autenticar } from "../middlewares/autenticar.js";
import * as c from "../controllers/deteccaoController.js";
const r = Router();
r.use(autenticar);
r.get("/", c.listar);
r.get("/:id", c.buscar);
export default r;
