
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const router = useRouter();

  async function entrar(e) {
    e.preventDefault();
    setErro('');

    try {
      const resposta = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          senha
        })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.erro || 'Não foi possível entrar.'
        );
      }

      router.push('/home');

    } catch (erro) {
      setErro(erro.message);
    }
  }

  return (
    <main className="mobile login-screen">

      <div className="login-logo">
        TUGARIN
      </div>

      <form
        onSubmit={entrar}
        className="login-form"
      >

        <label htmlFor="email">
          E-mail
        </label>

        <input
          id="email"
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="senha">
          Senha
        </label>

        <input
          id="senha"
          type="password"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        {erro && (
          <p className="erro">
            {erro}
          </p>
        )}

        <div className="login-actions">

          <button
            type="submit"
            className="btn azul"
          >
            Acessar
          </button>

          <button
            type="button"
            className="btn verde"
            onClick={() => router.push('/cadastro-usuario')}
          >
            Cadastrar
          </button>

        </div>

      </form>

    </main>
  );
}
