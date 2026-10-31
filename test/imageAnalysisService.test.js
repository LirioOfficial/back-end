import assert from "node:assert/strict";
import test from "node:test";
import { extrairPredicoes } from "../src/services/imageAnalysisService.js";

test("extrai previsões nos formatos comuns do workflow", () => {
  const previsoes = [{ class: "tartaruga", confidence: 0.95 }];
  assert.deepEqual(extrairPredicoes({ predictions: previsoes }), previsoes);
  assert.deepEqual(
    extrairPredicoes({
      outputs: [{ predictions: { predictions: previsoes } }],
    }),
    previsoes,
  );
});

test("retorna lista vazia quando o workflow não fornece previsões", () => {
  assert.deepEqual(extrairPredicoes({ outputs: [] }), []);
});
