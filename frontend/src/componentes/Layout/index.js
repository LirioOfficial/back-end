import BottomNav from '../BottomNav';

export default function Layout({
  titulo,
  ativo,
  children,
  semNav = false
}) {
  return (
    <main className="mobile">

      <header className="topbar">
        <span>{titulo}</span>
      </header>

      <section className="conteudo">
        {children}
      </section>

      {!semNav && (
        <BottomNav ativo={ativo} />
      )}

    </main>
  );
}