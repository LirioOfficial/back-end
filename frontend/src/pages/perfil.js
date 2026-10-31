import Layout from '../componentes/Layout';

export default function Perfil() {
  return (
    <Layout titulo="Perfil" ativo="/perfil">

      <div className="perfil-card">

        <img
          src="/imgs/foto-perfil.png"
          alt="Foto de perfil"
        />

        <h3>Rafael Lange</h3>

        <p>rafaellange@gmail.com</p>

        <a href="#">Editar dados</a>

      </div>

      <a className="sair" href="/">
        Sair ↪
      </a>

    </Layout>
  );
}