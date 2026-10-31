import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import tartarugaRoutes from "./routes/tartarugaRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import ocorrenciaRoutes from "./routes/ocorrenciaRoutes.js";
import monitoramentoRoutes from "./routes/monitoramentoRoutes.js";
import deteccaoRoutes from "./routes/deteccaoRoutes.js";
import { tratarErros } from "./middlewares/tratarErros.js";
import { obterOrigensCors } from "./config/cors.js";

const app = express();
app.use(cors({ origin: obterOrigensCors() }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", projeto: "Tugarin API" }),
);
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/tartarugas", tartarugaRoutes);
app.use("/api/ocorrencias", ocorrenciaRoutes);
app.use("/api/monitoramento", monitoramentoRoutes);
app.use("/api/deteccoes", deteccaoRoutes);
app.use("/api/imagens", imageRoutes);

app.use((req, res) =>
  res
    .status(404)
    .json({ erro: `Rota não encontrada: ${req.method} ${req.originalUrl}` }),
);
app.use(tratarErros);

export default app;
