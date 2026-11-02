# Agregador de Links — Front

Front do agregador de links (estilo Linktree): login e cadastro, edição de links e aparência, preview em tempo real e
página pública do perfil. A API está em [Agregador_Link_api](https://github.com/isaqu33/Agregador_Link_api).

- **Stack:** Next.js 14 (App Router), Auth.js v5, Chakra UI, Tailwind, react-query, MobX
- **Docs:** [`docs/`](docs/README.md) — rotas, proxy, variáveis e armadilhas

## Como funciona o login

O login é por email e senha via Auth.js. O token da API fica no cookie de sessão criptografado; o navegador só fala
com `/api/backend/...`, um proxy do Next que injeta o token. O navegador nunca recebe nem guarda o token da API.

## Requisitos

Docker e Docker Compose. O backend precisa estar no ar antes (ele cria a rede `agregador-network`).

## Rodando (desenvolvimento)

```bash
cp .env.example .env            # defina AUTH_SECRET (openssl rand -hex 32)
docker compose -f docker-compose.dev.yml up -d --build -V
```

Abra http://localhost:3071/login. Para ter um usuário, rode a seed no backend
(`npm run seed` dentro do container `api`).

## Rotas

| Rota | Descrição |
|---|---|
| `/login` | entrar / cadastrar |
| `/costumer` | links (exige sessão) |
| `/costumer/appearance` | aparência (exige sessão) |
| `/:id` | página pública do perfil |

## Verificação

```bash
npx tsc --noEmit
```

## Observações

As telas rodam só no navegador (`ssr: false`) e o `next build` ainda não foi validado; veja as pendências em
[`docs/README.md`](docs/README.md).
