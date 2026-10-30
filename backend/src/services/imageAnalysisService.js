const ROBOFLOW_WORKFLOW_URL =
  "https://serverless.roboflow.com/tugarin/workflows/tugarin-tartarugas-vtugarin-tartarugas-5-rfdetr-small-t1-logic";

const TAMANHO_MAXIMO_IMAGEM = 1_500_000;

function extrairBase64(imagem) {
  if (typeof imagem !== "string") {
    const error = new Error("Envie a imagem capturada no campo 'imagem'.");
    error.status = 400;
    throw error;
  }

  const correspondencia = imagem.match(
    /^data:image\/(jpeg|jpg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/,
  );

  if (!correspondencia) {
    const error = new Error(
      "Imagem inválida. Envie uma imagem JPEG, PNG ou WebP em formato Base64.",
    );
    error.status = 400;
    throw error;
  }

  const base64 = correspondencia[2];
  if (Buffer.byteLength(base64, "base64") > TAMANHO_MAXIMO_IMAGEM) {
    const error = new Error("A imagem excede o tamanho máximo permitido.");
    error.status = 413;
    throw error;
  }

  return base64;
}

export function extrairPredicoes(resultado) {
  const possibilidades = [
    resultado?.predictions,
    resultado?.predictions?.predictions,
    resultado?.outputs?.[0]?.predictions?.predictions,
    resultado?.outputs?.[0]?.predictions,
    resultado?.outputs?.[0]?.result?.predictions,
    resultado?.results?.[0]?.predictions,
  ];

  return possibilidades.find(Array.isArray) ?? [];
}

export async function analisarImagem(imagem) {
  const apiKey = process.env.ROBOFLOW_API_KEY;
  if (!apiKey) {
    const error = new Error("Integração de análise de imagens não configurada.");
    error.status = 503;
    throw error;
  }

  const base64 = extrairBase64(imagem);
  let resposta;

  try {
    resposta = await fetch(ROBOFLOW_WORKFLOW_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        inputs: {
          image: {
            type: "base64",
            value: base64,
          },
        },
      }),
      signal: AbortSignal.timeout(25_000),
    });
  } catch {
    const error = new Error("Não foi possível conectar ao serviço de análise.");
    error.status = 502;
    throw error;
  }

  let resultado;
  try {
    resultado = await resposta.json();
  } catch {
    const error = new Error("O serviço de análise retornou uma resposta inválida.");
    error.status = 502;
    throw error;
  }

  if (!resposta.ok) {
    // Não repassa a resposta do provedor, que pode conter dados internos.
    const error = new Error("O serviço de análise não conseguiu processar a imagem.");
    error.status = 502;
    throw error;
  }

  const predictions = extrairPredicoes(resultado);
  return {
    predictions,
    count: predictions.length,
  };
}
