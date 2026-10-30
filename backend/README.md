# Tugarin — API

Backend em Node.js, Express e MongoDB/Mongoose. Este repositório não contém views ou componentes de frontend.

## Configuração e execução

1. Instale Node.js e disponibilize MongoDB local ou Atlas.
2. Copie `.env.example` para `.env` (`Copy-Item .env.example .env` no PowerShell).
3. Configure `MONGODB_URI` e preencha `JWT_SECRET` com uma chave privada aleatória de pelo menos 32 bytes. Não compartilhe nem versione o `.env`.
4. Execute `npm install` e `npm run dev` ou `npm start`.
5. Verifique `GET http://localhost:3000/api/health`.

| Variável | Necessidade | Uso |
|---|---|---|
| `PORT` | Opcional; padrão `3000` | Porta HTTP |
| `NODE_ENV` | Opcional; use `development` localmente e `production` no deploy | Seleciona o padrão de CORS quando não há lista explícita |
| `MONGODB_URI` | Obrigatória | Conexão Mongoose |
| `JWT_SECRET` | Obrigatória para login/rotas privadas | Assinatura e validação JWT |
| `CORS_ORIGINS` | Opcional | Origens de frontend separadas por vírgula |
| `ROBOFLOW_API_KEY` | Obrigatória para análise de imagens | Chave privada do workflow Tugarin v5 no Roboflow |

Em desenvolvimento (`NODE_ENV` diferente de `production`), se `CORS_ORIGINS` não estiver definida, são permitidas as origens locais `http://localhost:3000` e `http://localhost:5173`. Em produção, sem configuração explícita, o middleware não libera cabeçalho CORS. Quando `CORS_ORIGINS` está definida, somente as origens listadas são permitidas. Troque as origens demonstrativas pela URL local realmente usada pelo frontend; nenhuma URL de produção é presumida.

Para resolver os registros SRV do MongoDB Atlas, o backend configura explicitamente os servidores DNS públicos `1.1.1.1` (Cloudflare) e `8.8.8.8` (Google) no Node.js. O ambiente precisa permitir consultas DNS a esses servidores para que a conexão funcione.

## Autenticação e respostas

Cadastro e login são públicos. As demais rotas abaixo exigem `Authorization: Bearer {{token}}`. O cadastro/login devolve JSON, sem hash de senha. Respostas de erro usam `{ "erro": "..." }`.

Status usuais: 400 para entrada inválida, 401 para ausência ou invalidade de token, 404 para registro inexistente ou fora do escopo do usuário, 409 para chave única duplicada, 500 para falha interna, 502 para falha na comunicação com o provedor de análise de imagens e 503 quando a análise de imagens não está configurada.

Exemplo sem credenciais reais:

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "senha": "<senha-local>"
}
```

O login devolve `{ "mensagem", "usuario": { "id", "nome", "email", "fotoPerfil" }, "token" }`. Use o token apenas em ambiente local, via variável privada do REST Client.

Cadastro e login ainda não têm rate limiting no backend. Antes de expor esses endpoints à internet, configure limitação de tentativas em um proxy confiável ou adicione middleware de rate limit e teste os limites no ambiente de desenvolvimento.

## Rotas

| Método | Caminho | Resposta de sucesso / comportamento |
|---|---|---|
| GET | `/api/health` | 200: `{ "status": "ok", "projeto": "Tugarin API" }`; verifica processo, não monitora desconexão posterior do banco |
| POST | `/api/auth/cadastro` | 201: `{ "mensagem", "usuario" }`; aceita nome, email e senha (mínimo 8 caracteres) |
| POST | `/api/auth/login` | 200: `{ "mensagem", "usuario", "token" }`; token dura 8 horas |
| GET | `/api/usuarios/me` | 200: `{ "usuario": { "nome", "email", "fotoPerfil", "createdAt", "updatedAt" } }` |
| PATCH | `/api/usuarios/me` | 200 com perfil atualizado; campos aceitos: `nome`, `email`, `fotoPerfil` |
| GET | `/api/tartarugas` | 200: array das tartarugas próprias |
| GET | `/api/tartarugas/:id` | 200: documento; 400 para ID inválido |
| POST | `/api/tartarugas` | 201: documento criado |
| PATCH/PUT | `/api/tartarugas/:id` | 200: documento atualizado; 400 se não houver campo permitido |
| DELETE | `/api/tartarugas/:id` | 200: mensagem; exclusão permanente |
| GET | `/api/ocorrencias` | 200: `{ "items": [...], "pagination": { "page", "limit", "total", "pages" } }` |
| GET | `/api/ocorrencias/:id` | 200: documento; 400 para ID inválido |
| POST | `/api/ocorrencias` | 201: documento; origem definida no servidor como `manual` |
| PATCH | `/api/ocorrencias/:id` | 200: documento atualizado; 400 se não houver campo permitido |
| DELETE | `/api/ocorrencias/:id` | 200: mensagem; exclusão permanente |
| GET | `/api/monitoramento` | 200: array próprio ordenado por nome; sem filtros ou paginação |
| GET | `/api/deteccoes` | 200: array das até 100 detecções próprias mais recentes; sem filtros |
| GET | `/api/deteccoes/:id` | 200: documento; 400 para ID inválido |
| POST | `/api/imagens/analisar` | 200: `{ "predictions": [...], "count": 0 }`; recebe `{ "imagem": "data:image/jpeg;base64,..." }` e encaminha ao workflow Roboflow; exige autenticação |

As rotas de tartaruga e ocorrência aplicam escopo por `criadoPor`. Para ocorrências, `tipo` aceita `Avistamento`, `Encalhe`, `Ninho` ou `Eclosão`; a busca `busca` consulta código, espécie, nome e cidade do local. `page` começa em 1 e `limit` assume 20 por padrão, limitado a 100.

Exemplo de ocorrência:

```json
{
  "tipo": "Avistamento",
  "especie": "Não identificada",
  "local": {
    "nome": "Praia de exemplo",
    "cidade": "Cananéia",
    "estado": "SP"
  },
  "observacoes": "Registro de teste",
  "imagens": []
}
```

## REST Client (VS Code)

`testes.http` usa variáveis para tokens, senhas e IDs. Copie `http-client.env.json.example` para `http-client.env.json`, arquivo ignorado pelo Git, selecione o ambiente `local` e preencha os valores apenas na cópia local. Faça login para obter tokens e use registros de teste próprios. Os exemplos incluem chamadas DELETE, que removem permanentemente o registro indicado.

## Limitações e dados existentes

- A análise de imagem encaminha quadros Base64 ao workflow Tugarin v5 no Roboflow. Configure `ROBOFLOW_API_KEY` no `.env`; a chave fica somente no backend.
- A câmera do navegador, a captura periódica dos quadros, a pré-visualização e o desenho das caixas de detecção pertencem ao frontend e não estão neste repositório backend.
- A rota de análise retorna as previsões e a contagem, mas não grava automaticamente cada quadro em `deteccoes`, evitando criar registros repetidos a cada chamada da câmera.
- Não há upload permanente nem armazenamento binário das imagens no MongoDB.
- Monitoramentos e detecções têm somente endpoints GET. Não há endpoints de cadastro, edição ou exclusão.
- Registros legados de tartarugas sem `criadoPor` não aparecem nas consultas autenticadas. Nenhuma migração automática é executada.
- Exclusões de tartarugas e ocorrências são permanentes pela API; não há restauração/soft delete.