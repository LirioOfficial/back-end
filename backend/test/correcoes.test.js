import assert from "node:assert/strict";
import test from "node:test";
import mongoose from "mongoose";
import { atualizar as atualizarTartaruga } from "../src/controllers/tartarugaController.js";
import { atualizar as atualizarOcorrencia, criar as criarOcorrencia } from "../src/controllers/ocorrenciaController.js";
import { atualizarPerfil } from "../src/services/usuarioService.js";
import { emailValido, normalizarEmail } from "../src/utils/email.js";
import { tratarErros } from "../src/middlewares/tratarErros.js";
import app from "../src/app.js";
import { once } from "node:events";
import { randomBytes } from "node:crypto";
import { autenticar } from "../src/middlewares/autenticar.js";
import { obterOrigensCors } from "../src/config/cors.js";
import { mock } from "node:test";
import Ocorrencia from "../src/models/Ocorrencia.js";
import { criarOcorrencia as criarOcorrenciaService } from "../src/services/ocorrenciaService.js";

function respostaFalsa() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

const idValido = new mongoose.Types.ObjectId().toString();
const usuario = { id: new mongoose.Types.ObjectId().toString() };

test("PATCH de tartaruga rejeita corpo sem campos permitidos", async () => {
  const res = respostaFalsa();
  await atualizarTartaruga({ params: { id: idValido }, usuario, body: { desconhecido: true } }, res, assert.fail);
  assert.equal(res.statusCode, 400);
});

test("PATCH de ocorrência rejeita corpo sem campos permitidos", async () => {
  const res = respostaFalsa();
  await atualizarOcorrencia({ params: { id: idValido }, usuario, body: { desconhecido: true } }, res, assert.fail);
  assert.equal(res.statusCode, 400);
});

test("criação de ocorrência rejeita ID de tartaruga malformado", async () => {
  const res = respostaFalsa();
  await criarOcorrencia({ params: {}, usuario, body: { tipo: "Avistamento", especie: "Não identificada", tartaruga: "id-inválido" } }, res, assert.fail);
  assert.equal(res.statusCode, 400);
});

test("service de criação ignora origem enviada e força origem manual", async (t) => {
  t.mock.method(Ocorrencia, "create", async (documento) => documento);
  const documento = await criarOcorrenciaService(
    { tipo: "Avistamento", especie: "Não identificada", origem: "câmera" },
    idValido,
  );
  assert.equal(documento.origem, "manual");
  assert.equal(documento.criadoPor.toString(), idValido);
});

test("PATCH de perfil normaliza e valida e-mail como o cadastro", async () => {
  assert.equal(normalizarEmail("  Pessoa@Exemplo.com "), "pessoa@exemplo.com");
  assert.equal(emailValido("pessoa@exemplo.com"), true);
  assert.equal(emailValido("email-inválido"), false);
  await assert.rejects(atualizarPerfil(idValido, { email: "email-inválido" }), { status: 400 });
});

test("CastError retorna 400 sem expor detalhes do erro", () => {
  const res = respostaFalsa();
  tratarErros({ name: "CastError", message: "conteúdo interno" }, {}, res, () => {});
  assert.equal(res.statusCode, 400);
  assert.equal(JSON.stringify(res.body).includes("conteúdo interno"), false);
});

test("erro interno retorna 500 genérico sem detalhes", () => {
  const res = respostaFalsa();
  tratarErros({ name: "Error", message: "segredo interno" }, {}, res, () => {});
  assert.equal(res.statusCode, 500);
  assert.equal(res.body.erro, "Erro interno do servidor.");
  assert.equal(JSON.stringify(res.body).includes("segredo interno"), false);
});

test("rotas privadas recusam requisições sem token", async (t) => {
  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
    server.closeAllConnections();
  }));

  const address = server.address();
  const paths = [
    "/api/usuarios/me",
    "/api/tartarugas",
    "/api/ocorrencias",
    "/api/monitoramento",
    "/api/deteccoes",
    "/api/imagens/analisar",
  ];
  for (const path of paths) {
    const response = await fetch(`http://127.0.0.1:${address.port}${path}`, {
      method: path.endsWith("/analisar") ? "POST" : "GET",
    });
    assert.equal(response.status, 401, `${path} deve exigir autenticação`);
  }
});

test("middleware rejeita token JWT malformado sem consultar usuário", async () => {
  const valorAnterior = process.env.JWT_SECRET;
  process.env.JWT_SECRET = randomBytes(32).toString("hex");
  try {
    const res = respostaFalsa();
    await autenticar({ headers: { authorization: "Bearer not-a-token" } }, res, assert.fail);
    assert.equal(res.statusCode, 401);
  } finally {
    if (valorAnterior === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = valorAnterior;
  }
});

test("CORS usa lista configurada, localhost no desenvolvimento e nenhuma origem padrão em produção", () => {
  assert.deepEqual(obterOrigensCors({ CORS_ORIGINS: "https://app.example, https://admin.example" }), [
    "https://app.example",
    "https://admin.example",
  ]);
  assert.deepEqual(obterOrigensCors({ NODE_ENV: "development" }), [
    "http://localhost:3000",
    "http://localhost:5173",
  ]);
  assert.deepEqual(obterOrigensCors({ NODE_ENV: "production" }), []);
});
