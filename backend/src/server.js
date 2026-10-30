import "dotenv/config";
import app from "./app.js";
import { conectarBanco } from "./config/database.js";

const PORT = process.env.PORT || 3000;

try {
  await conectarBanco();
  app.listen(PORT, () =>
    console.log(`Tugarin API rodando em http://localhost:${PORT}`),
  );
} catch (error) {
  // Connection errors can contain deployment details; log only the error type.
  console.error("Não foi possível iniciar a API:", error.name || "Erro");
  process.exit(1);
}
