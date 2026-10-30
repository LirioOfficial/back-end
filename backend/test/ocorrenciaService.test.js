import "dotenv/config";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import mongoose from "mongoose";
import Ocorrencia from "../src/models/Ocorrencia.js";
import Tartaruga from "../src/models/Tartaruga.js";
import {
  atualizarOcorrencia,
  buscarOcorrencia,
  criarOcorrencia,
  excluirOcorrencia,
} from "../src/services/ocorrenciaService.js";
import {
  atualizarTartaruga,
  buscarTartarugaPorId,
  excluirTartaruga,
} from "../src/services/tartarugaService.js";

const testMongoUri = process.env.TEST_MONGODB_URI;

function validarUriBancoTeste(uri) {
  const uriParsed = new URL(uri);
  const nomeBanco = decodeURIComponent(uriParsed.pathname.replace(/^\/+/, ""));
  const nomeBancoConfigurado = uriParsed.searchParams.get("dbName");
  const bancoIsolado = nomeBanco === "test" || /[_-]test$/i.test(nomeBanco);
  if (!bancoIsolado || (nomeBancoConfigurado && nomeBancoConfigurado !== nomeBanco)) {
    throw new Error("TEST_MONGODB_URI precisa apontar para um banco terminado em _test, -test ou test.");
  }
}

test(
  "atualização persiste observacoes, força origem manual e protege a propriedade",
  { skip: !testMongoUri && "Defina TEST_MONGODB_URI para um banco MongoDB isolado." },
  async (t) => {
    validarUriBancoTeste(testMongoUri);
    let ocorrencia;
    let tartaruga;
    t.after(async () => {
      try {
        if (ocorrencia) await Ocorrencia.deleteOne({ _id: ocorrencia._id });
        if (tartaruga) await Tartaruga.deleteOne({ _id: tartaruga._id });
      } finally {
        await mongoose.disconnect();
      }
    });
    await mongoose.connect(testMongoUri, { serverSelectionTimeoutMS: 5000 });

    const criadoPor = new mongoose.Types.ObjectId();
    const outroUsuario = new mongoose.Types.ObjectId();
    tartaruga = await Tartaruga.create({
      identificacao: `TEST-${randomUUID()}`,
      especie: "Não identificada",
      situacao: "Teste",
      criadoPor,
    });
    ocorrencia = await criarOcorrencia({
      codigo: `TEST-${randomUUID()}`,
      tipo: "Avistamento",
      especie: "Não identificada",
      observacoes: "Valor original",
      origem: "câmera",
      tartaruga: tartaruga.id,
    }, criadoPor);

    assert.equal(ocorrencia.origem, "manual");
    const resposta = await atualizarOcorrencia(
      ocorrencia.id,
      { observacoes: "Valor atualizado pelo teste" },
      criadoPor,
    );
    const persistida = await Ocorrencia.findOne({ _id: ocorrencia._id, criadoPor });

    assert.equal(resposta.observacoes, "Valor atualizado pelo teste");
    assert.equal(persistida.observacoes, "Valor atualizado pelo teste");
    assert.ok(resposta.updatedAt >= ocorrencia.updatedAt);
    assert.equal(await buscarOcorrencia(ocorrencia.id, outroUsuario), null);
    assert.equal(await atualizarOcorrencia(ocorrencia.id, { observacoes: "Acesso indevido" }, outroUsuario), null);
    assert.equal(await excluirOcorrencia(ocorrencia.id, outroUsuario), null);
    assert.equal(await buscarTartarugaPorId(tartaruga.id, outroUsuario), null);
    assert.equal(await atualizarTartaruga(tartaruga.id, { situacao: "Acesso indevido" }, outroUsuario), null);
    assert.equal(await excluirTartaruga(tartaruga.id, outroUsuario), null);
  },
);
