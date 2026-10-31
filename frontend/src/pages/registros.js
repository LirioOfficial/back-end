import { useEffect, useMemo, useState } from 'react';
import Layout from '../componentes/Layout';

export default function Registros() {
  const [lista, setLista] = useState([]);
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('Todas');

  useEffect(() => {
    fetch('/api/tartarugas')
      .then((r) => r.ok ? r.json() : [])
      .then(setLista)
      .catch(() => setLista([]));
  }, []);

  const filtrados = useMemo(() => {
    return lista.filter((x) => {
      const tipo = String(x.tipoOcorrencia || '').toLowerCase();

      const correspondeFiltro =
        filtro === 'Todas' ||
        (filtro === 'Avistamentos' && tipo === 'avistamento') ||
        (filtro === 'Ninhos' && tipo === 'ninho') ||
        (filtro === 'Encalhes' && tipo === 'encalhe');

      const texto = [
        x.identificacao,
        x.local,
        x.especie
      ].join(' ').toLowerCase();

      return correspondeFiltro && texto.includes(busca.toLowerCase());
    });
  }, [lista, busca, filtro]);

  return (
    <Layout titulo="Registros" ativo="/registros">

      <div className="busca-card">

        <label>Acompanhar registros</label>

        <input
          placeholder="⌕  Buscar por ID, praia ou espécie"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        <div className="filtros">

          {['Todas', 'Avistamentos', 'Ninhos', 'Encalhes'].map((f) => (
            <button
              key={f}
              className={filtro === f ? 'ativo' : ''}
              onClick={() => setFiltro(f)}
            >
              {f}
            </button>
          ))}

        </div>

      </div>

      {filtrados.length === 0 ? (

        <p className="vazio">
          {lista.length === 0
            ? 'Ainda não há registros'
            : 'Nenhum registro encontrado'}
        </p>

      ) : (

        <div className="lista-registros">

          {filtrados.map((t) => (
            <article className="registro" key={t.id}>

              <b>
                {t.identificacao || `Ocorrência #${t.id}`}
              </b>

              <span>{t.especie}</span>

              <small>{t.local}</small>

              <small>{t.situacao}</small>

            </article>
          ))}

        </div>

      )}

      <a className="botao-flutuante" href="/registrar">
        +
      </a>

    </Layout>
  );
}