import Layout from '../componentes/Layout';

export default function Mapa() {
  return (
    <Layout titulo="Mapa" ativo="/mapa">

      <div className="mapa">

        <input placeholder="Pesquisar local" />

        <div className="pins">
          ⌖　⌖
          <br />
          <br />
          　⌖
          <br />
          <br />
          <br />
          ⌖　　　⌖
        </div>

        <p>
          Cananéia · Baía dos Golfinhos · Praia do Pereirinha
        </p>

      </div>

    </Layout>
  );
}