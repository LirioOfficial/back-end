import Layout from '../componentes/Layout';

export default function Home() {
  const meses = [
    'Jan', 'Fev', 'Mar', 'Abr',
    'Mai', 'Jun', 'Jul', 'Ago'
  ];

  const valores = [12, 20, 14, 24, 9, 5, 15, 19];

  return (
    <Layout titulo="Início" ativo="/home">

      <div className="boas-vindas">
        <h2>Olá, rafael!</h2>
        <p>Monitoramento em Cananéia - SP</p>
      </div>

      <div className="painel">
        <h3>Resumo do monitoramento</h3>

        <div className="metricas">

          <div>
            <img
              src="/imgs/icon-ocorrencias.png"
              alt="Ocorrências"
            />
            <strong>13</strong>
            <span>Ocorrências</span>
          </div>

          <div>
            <img
              src="/imgs/icon-tugarin.png"
              alt="Tartarugas"
            />
            <strong>6</strong>
            <span>Tartarugas</span>
          </div>

          <div>
            <img
              src="/imgs/icon-ninhos.png"
              alt="Ninhos"
            />
            <strong>13</strong>
            <span>Ninhos</span>
          </div>

          <div>
            <img
              src="/imgs/icon-localizacao.png"
              alt="Localização"
            />
            <strong>20</strong>
            <span>Ocorrências</span>
          </div>

        </div>
      </div>

      <div className="painel grafico">
        <h3>
          Ocorrências por período
          <small>2026</small>
        </h3>

        <div className="barras">
          {valores.map((n, i) => (
            <div key={i}>
              <i style={{ height: `${n * 4}px` }} />
              <small>{meses[i]}</small>
            </div>
          ))}
        </div>
      </div>

      <div className="painel atividade">
        <h3>
          Atividades recentes
          <a href="/registros">Ver todas →</a>
        </h3>

        <div className="atividade-item">
          <img
            src="/imgs/toruga-cinza.png"
            alt="Registro de tartaruga"
          />

          <div>
            <b>Ninho</b>
            <small>Ocorrência #001</small>
            <small>Praia do Pereirinha - Cananéia</small>
            <small>30/07/2026 - 09h11</small>
          </div>

          <a href="/registros">Ver detalhes</a>
        </div>
      </div>

    </Layout>
  );
}