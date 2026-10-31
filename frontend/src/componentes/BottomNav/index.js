import Link from 'next/link';

const itens = [
  {
    nome: 'Início',
    imagem: '/imgs/icon-home.png',
    rota: '/home'
  },
  {
    nome: 'Ocorrências',
    imagem: '/imgs/icon-ocorrencias.png',
    rota: '/registros'
  },
  {
    nome: 'Tugarin',
    imagem: '/imgs/icon-tugarin.png',
    rota: '/monitoramento'
  },
  {
    nome: 'Mapa',
    imagem: '/imgs/icon-mapa.png',
    rota: '/mapa'
  },
  {
    nome: 'Perfil',
    imagem: '/imgs/icon-perfil.png',
    rota: '/perfil'
  }
];

export default function BottomNav({ ativo }) {
  return (
    <nav className="bottom-nav">
      {itens.map((item) => (
        <Link
          href={item.rota}
          key={item.nome}
          scroll={false}
          className={`nav-item ${ativo === item.nome ? 'ativo' : ''}`}
        >
          <img
            src={item.imagem}
            alt={item.nome}
          />
        </Link>
      ))}
    </nav>
  );
}