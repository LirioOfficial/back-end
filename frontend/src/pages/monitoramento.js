import { useState } from 'react';
import Layout from '../componentes/Layout';

export default function Monitoramento() {
  const [ligada, setLigada] = useState(false);

  return (
    <Layout titulo="Monitoramento" ativo="/monitoramento">

      <div className="camera-titulo">
        Baía dos Golfinhos
        <small>CAM_05</small>
      </div>

      <div className="camera-card">

        <div className="camera-imagem">

          <span className="live">
            ● {ligada ? 'Ao vivo' : 'Demonstração'}
          </span>

          <img
            src="/imgs/toruga-cinza.png"
            alt="Prévia da câmera"
          />

        </div>

        <div className="camera-info">
          <span>Cananéia - SP</span>
          <small>Última atualização: agora</small>
        </div>

        <p className="conexao">
          ◉ Conexão {ligada ? 'ativa' : 'disponível'}
        </p>

        <button
          className="btn verde"
          onClick={() => setLigada(!ligada)}
        >
          {ligada ? 'Encerrar câmera' : 'Iniciar câmera'}
        </button>

      </div>

      <div className="painel">

        <h3>Atividade recente</h3>

        <p>
          Detecções recentes <b>—</b>
        </p>

        <p>
          Última ocorrência <b>13/11/2026 - 14:23</b>
        </p>

      </div>

      <h3 className="subtitulo">
        Ocorrências anteriores
      </h3>

      <div className="registro">

        <b>Tartaruga adulta</b>

        <small>
          Ocorrência #003 · Baía dos Golfinhos - Cananéia
        </small>

        <small>Pendente</small>

      </div>

    </Layout>
  );
}