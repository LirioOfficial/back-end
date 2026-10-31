const ORIGENS_LOCAIS = ["http://localhost:3001", "http://localhost:5173"];

export function obterOrigensCors(env = process.env) {
  const configuradas = env.CORS_ORIGINS?.split(",")
    .map((origem) => origem.trim())
    .filter(Boolean);
  if (configuradas?.length) return configuradas;
  if (env.NODE_ENV === "production") return [];
  return ORIGENS_LOCAIS;
}
