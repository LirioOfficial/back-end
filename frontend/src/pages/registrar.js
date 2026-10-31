import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Layout from '../componentes/Layout';

const especies = [
  'Não identificada',
  'Tartaruga-verde',
  'Tartaruga-cabeçuda',
  'Tartaruga-de-pente',
  'Tartaruga-de-couro',
  'Tartaruga-oliva'
];

function SeletorEspecie({ value, onChange }) {
  const [aberto, setAberto] = useState(false);
  const seletorRef = useRef(null);

  useEffect(() => {
    function fecharAoClicarFora(evento) {
      if (
        seletorRef.current &&
        !seletorRef.current.contains(evento.target)
      ) {
        setAberto(false);
      }
    }

    document.addEventListener('mousedown', fecharAoClicarFora);

    return () => {
      document.removeEventListener('mousedown', fecharAoClicarFora);
    };
  }, []);

  return (
    <div className="seletor-especie" ref={seletorRef}>
      <button
        type="button"
        className={`seletor-especie-botao ${aberto ? 'aberto' : ''}`}
        onClick={() => setAberto(!aberto)}
        aria-expanded={aberto}
      >
        <span>
          {value || 'Selecione a espécie'}
        </span>

        <span className={`seletor-especie-seta ${aberto ? 'rotacionada' : ''}`}>
          ⌄
        </span>
      </button>

      {aberto && (
        <div className="seletor-especie-opcoes">
          {especies.map((especie) => (
            <button
              type="button"
              key={especie}
              className={`seletor-especie-opcao ${
                value === especie ? 'selecionada' : ''
              }`}
              onClick={() => {
                onChange(especie);
                setAberto(false);
              }}
            >
              {especie}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Registrar() {
  const [etapa, setEtapa] = useState(1);

  const [form, setForm] = useState({
    identificacao: '',
    tipoOcorrencia: 'Avistamento',
    especie: 'Não identificada',
    local: '',
    observacoes: '',
    data: '',
    hora: '',
    sexo: '',
    fase: '',
    comprimento: '',
    largura: '',
    peso: '',
    situacao: '',
    observacoesAdicionais: ''
  });

  const router = useRouter();

  function mudar(k, v) {
    setForm({
      ...form,
      [k]: v
    });
  }

  async function salvar(e) {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);

    Object.entries(form).forEach(([k, v]) => {
      fd.append(k, v);
    });

    try {
      const resposta = await fetch('/api/tartarugas', {
        method: 'POST',
        body: fd
      });

      if (!resposta.ok) {
        throw new Error('Falha ao salvar registro');
      }

      router.push('/registros');

    } catch (erro) {
      alert(erro.message);
    }
  }

  return (
    <Layout titulo="Registrar Tartaruga" ativo="/registros">

      <div className="etapas">
        <span className={etapa === 1 ? 'corrente' : ''}>
          1. Identificação
        </span>

        <span className={etapa === 2 ? 'corrente' : ''}>
          2. Detalhes
        </span>
      </div>

      <form onSubmit={salvar} className="form-registro">

        {etapa === 1 ? (
          <>
            <label>Identificação do registro</label>

            <input
              placeholder="Gerado automaticamente ao salvar"
              value={form.identificacao}
              onChange={(e) => mudar('identificacao', e.target.value)}
            />

            <label>Tipo de ocorrência</label>

            <div className="opcoes-grid">
              {['Avistamento', 'Encalhe', 'Ninho', 'Eclosão'].map((x) => (
                <button
                  type="button"
                  className={form.tipoOcorrencia === x ? 'escolhido' : ''}
                  onClick={() => mudar('tipoOcorrencia', x)}
                  key={x}
                >
                  {x}
                </button>
              ))}
            </div>

            <label>Espécie</label>

            <SeletorEspecie
              value={form.especie}
              onChange={(valor) => mudar('especie', valor)}
            />

            <label>Local da ocorrência</label>

            <input
              placeholder="Cidade, praia e coordenadas"
              value={form.local}
              onChange={(e) => mudar('local', e.target.value)}
            />

            <label>Observações</label>

            <textarea
              placeholder="Descreva observações feitas em campo..."
              value={form.observacoes}
              onChange={(e) => mudar('observacoes', e.target.value)}
            />

            <label className="upload-label">
              Adicionar imagem

              <input
                type="file"
                name="imagem"
                accept="image/*"
              />
            </label>

            <button
              className="btn verde central"
              type="button"
              onClick={() => setEtapa(2)}
            >
              Próximo
            </button>
          </>
        ) : (
          <>
            <label>Data e horário da ocorrência</label>

            <div className="dupla">
              <input
                type="date"
                value={form.data}
                onChange={(e) => mudar('data', e.target.value)}
              />

              <input
                type="time"
                value={form.hora}
                onChange={(e) => mudar('hora', e.target.value)}
              />
            </div>

            <label>Identificação individual</label>

            <input
              placeholder="Tag ou código da equipe"
              value={form.identificacao}
              onChange={(e) => mudar('identificacao', e.target.value)}
            />

            <label>Sexo</label>

            {['Macho', 'Fêmea', 'Não identificado'].map((x) => (
              <label className="radio" key={x}>
                <input
                  type="radio"
                  name="sexo"
                  checked={form.sexo === x}
                  onChange={() => mudar('sexo', x)}
                />
                {x}
              </label>
            ))}

            <label>Fase de vida</label>

            {['Filhote', 'Juvenil', 'Adulto'].map((x) => (
              <label className="radio" key={x}>
                <input
                  type="radio"
                  name="fase"
                  checked={form.fase === x}
                  onChange={() => mudar('fase', x)}
                />
                {x}
              </label>
            ))}

            <label>Medidas</label>

            <div className="dupla tres">
              <input
                placeholder="Comprimento (cm)"
                value={form.comprimento}
                onChange={(e) => mudar('comprimento', e.target.value)}
              />

              <input
                placeholder="Largura (cm)"
                value={form.largura}
                onChange={(e) => mudar('largura', e.target.value)}
              />

              <input
                placeholder="Peso (kg)"
                value={form.peso}
                onChange={(e) => mudar('peso', e.target.value)}
              />
            </div>

            <label>Situação</label>

            {[
              'Sem ferimentos',
              'Leves',
              'Moderado',
              'Grave',
              'Óbito'
            ].map((x) => (
              <label className="radio" key={x}>
                <input
                  type="radio"
                  name="situacao"
                  checked={form.situacao === x}
                  onChange={() => mudar('situacao', x)}
                />
                {x}
              </label>
            ))}

            <label>Observações adicionais</label>

            <textarea
              value={form.observacoesAdicionais}
              onChange={(e) => mudar('observacoesAdicionais', e.target.value)}
            />

            <div className="dupla">
              <button
                type="button"
                className="btn contorno"
                onClick={() => setEtapa(1)}
              >
                Voltar
              </button>

              <button className="btn verde" type="submit">
                Pronto
              </button>
            </div>
          </>
        )}

      </form>
    </Layout>
  );
}