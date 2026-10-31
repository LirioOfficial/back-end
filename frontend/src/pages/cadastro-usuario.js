import { useState } from 'react';
import { useRouter } from 'next/router';

export default function CadastroUsuario() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const router = useRouter();

  async function enviar(e) {
    e.preventDefault();

    const r = await fetch('/api/auth/cadastro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, senha })
    });

    if (r.ok) {
      router.push('/');
    } else {
      alert('Não foi possível cadastrar.');
    }
  }

  return (
    <main className="mobile login-screen">

      <h1 className="titulo-cadastro">
        Criar conta
      </h1>

      <form className="login-form" onSubmit={enviar}>

        <label>E-mail</label>

        <input
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Senha</label>

        <input
          type="password"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <button className="btn verde" type="submit">
          Cadastrar
        </button>

      </form>
    </main>
  );
}