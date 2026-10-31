import { Router } from "express";
import { me, atualizarMe } from "../controllers/usuarioController.js";
import { autenticar } from "../middlewares/autenticar.js";
const router = Router();
router.use(autenticar);
router.get("/me", me);
router.patch("/me", atualizarMe);
export default router;
