export function tratarErros(error, _req, res, _next) {
  if (error.name === "SyntaxError" && error.status === 400 && "body" in error) {
    return res.status(400).json({ erro: "JSON inválido." });
  }
  if (error.name === "CastError") {
    return res.status(400).json({ erro: "ID ou valor inválido." });
  }
  if (error.code === 11000) {
    return res.status(409).json({ erro: "Já existe um registro com esses dados únicos." });
  }
  if (error.name === "ValidationError") {
    return res.status(400).json({ erro: "Dados inválidos." });
  }
  return res.status(error.status || 500).json({
    erro: error.status ? error.message : "Erro interno do servidor.",
  });
}
