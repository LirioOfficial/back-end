(() => {
  const video = document.getElementById('cameraVideo');
  const canvas = document.getElementById('detectionCanvas');
  const ctx = canvas.getContext('2d');
  const placeholder = document.getElementById('cameraPlaceholder');
  const startButton = document.getElementById('startCamera');
  const stopButton = document.getElementById('stopCamera');
  const message = document.getElementById('cameraMessage');
  const livePill = document.getElementById('livePill');
  const countValue = document.getElementById('countValue');
  const countStatus = document.getElementById('countStatus');
  const apiUrlInput = document.getElementById('apiUrl');
  const tokenInput = document.getElementById('authToken');

  let cameraStream = null;
  let detectionTimer = null;
  let detectionBusy = false;

  function extrairPredicoes(resultado) {
    const possibilidades = [
      resultado?.predictions,
      resultado?.predictions?.predictions,
      resultado?.outputs?.[0]?.predictions?.predictions,
      resultado?.outputs?.[0]?.predictions,
      resultado?.outputs?.[0]?.result?.predictions,
      resultado?.results?.[0]?.predictions
    ];
    return possibilidades.find(Array.isArray) ?? [];
  }

  function desenharPredicoes(predicoes, larguraOriginal, alturaOriginal, larguraCaptura, alturaCaptura) {
    canvas.width = larguraOriginal;
    canvas.height = alturaOriginal;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const sx = larguraOriginal / larguraCaptura;
    const sy = alturaOriginal / alturaCaptura;

    for (const p of predicoes) {
      let x, y, w, h;
      if ([p.x1,p.y1,p.x2,p.y2].every(Number.isFinite)) {
        x = p.x1 * sx; y = p.y1 * sy; w = (p.x2 - p.x1) * sx; h = (p.y2 - p.y1) * sy;
      } else if ([p.x,p.y,p.width,p.height].every(Number.isFinite)) {
        x = (p.x - p.width / 2) * sx; y = (p.y - p.height / 2) * sy; w = p.width * sx; h = p.height * sy;
      } else continue;

      const classe = p.class || p.label || p.class_name || 'Tartaruga';
      const confianca = Number.isFinite(p.confidence) ? ` ${(p.confidence * 100).toFixed(0)}%` : '';
      ctx.lineWidth = Math.max(2, canvas.width / 240);
      ctx.strokeStyle = '#12c7b1';
      ctx.strokeRect(x, y, w, h);
      const texto = `${classe}${confianca}`;
      ctx.font = `bold ${Math.max(13, canvas.width / 32)}px Arial`;
      const textoLargura = ctx.measureText(texto).width;
      const etiquetaY = Math.max(0, y - 26);
      ctx.fillStyle = '#12c7b1';
      ctx.fillRect(x, etiquetaY, textoLargura + 12, 25);
      ctx.fillStyle = '#062e2a';
      ctx.fillText(texto, x + 6, etiquetaY + 18);
    }
  }

  async function detectarQuadro() {
    if (!cameraStream || video.readyState < 2 || detectionBusy || !video.videoWidth) return;
    const token = tokenInput.value.trim();
    if (!token) {
      message.textContent = 'Informe o token JWT para autorizar a análise.';
      countStatus.textContent = 'Aguardando autenticação';
      return;
    }

    detectionBusy = true;
    try {
      const larguraOriginal = video.videoWidth;
      const alturaOriginal = video.videoHeight;
      const larguraCaptura = Math.min(640, larguraOriginal);
      const escala = larguraCaptura / larguraOriginal;
      const alturaCaptura = Math.round(alturaOriginal * escala);
      const captura = document.createElement('canvas');
      captura.width = larguraCaptura;
      captura.height = alturaCaptura;
      captura.getContext('2d').drawImage(video, 0, 0, larguraCaptura, alturaCaptura);
      const imagem = captura.toDataURL('image/jpeg', 0.7);

      const baseUrl = apiUrlInput.value.trim().replace(/\/$/, '');
      const resposta = await fetch(`${baseUrl}/api/imagens/analisar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ imagem })
      });
      const resultado = await resposta.json().catch(() => ({}));
      if (!resposta.ok) throw new Error(resultado.erro || `Falha na análise (HTTP ${resposta.status}).`);

      const predicoes = extrairPredicoes(resultado);
      desenharPredicoes(predicoes, larguraOriginal, alturaOriginal, larguraCaptura, alturaCaptura);
      countValue.textContent = String(typeof resultado.count === 'number' ? resultado.count : predicoes.length);
      countStatus.textContent = 'Detecção ativa';
      message.textContent = 'Quadro analisado pelo Roboflow.';
    } catch (erro) {
      console.error('Erro na detecção:', erro);
      countStatus.textContent = 'Falha na detecção';
      message.textContent = erro.message;
    } finally {
      detectionBusy = false;
    }
  }

  function stopCamera() {
    if (detectionTimer) { clearInterval(detectionTimer); detectionTimer = null; }
    if (cameraStream) { cameraStream.getTracks().forEach(track => track.stop()); cameraStream = null; }
    video.pause(); video.srcObject = null; video.hidden = true; canvas.hidden = true;
    placeholder.hidden = false; livePill.hidden = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    countValue.textContent = '—'; countStatus.textContent = 'Reconhecimento parado';
    startButton.disabled = false; stopButton.disabled = true;
    message.textContent = 'Câmera encerrada.';
  }

  async function startCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      message.textContent = 'O navegador não disponibilizou acesso à câmera. Abra a página em localhost ou HTTPS.';
      return;
    }
    if (!tokenInput.value.trim()) {
      message.textContent = 'Faça login no sistema e cole o token JWT retornado pela API.';
      tokenInput.focus();
      return;
    }
    startButton.disabled = true;
    message.textContent = 'Solicitando acesso à câmera...';
    try {
      cameraStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 640 }, height: { ideal: 480 } }
      });
      video.srcObject = cameraStream; video.hidden = false; canvas.hidden = false;
      placeholder.hidden = true; livePill.hidden = false; stopButton.disabled = false;
      await video.play();
      message.textContent = 'Câmera ativa. Conectando ao detector...';
      countStatus.textContent = 'Conectando ao detector';
      await detectarQuadro();
      detectionTimer = setInterval(detectarQuadro, 2000);
    } catch (erro) {
      console.error('Erro ao iniciar a câmera:', erro);
      message.textContent = erro.name === 'NotAllowedError'
        ? 'Permissão da câmera negada. Libere o acesso nas configurações do navegador.'
        : `Não foi possível iniciar a câmera: ${erro.message}`;
      if (cameraStream) stopCamera();
      startButton.disabled = false;
    }
  }

  startButton.addEventListener('click', startCamera);
  stopButton.addEventListener('click', stopCamera);
  window.addEventListener('pagehide', stopCamera);
})();
