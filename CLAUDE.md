# Agregador_Link_Front (front)

Front Next.js 14 (App Router) + Auth.js do agregador de links. A API fica em `../Agregador_Link_api` (NestJS + MongoDB).

**Contexto completo em `docs/`** (`README.md`, `back.md`, `front.md`). Leia antes de mexer; tem portas, rotas, fluxo de
auth, variáveis e armadilhas.

## Regras de trabalho

- **`docs/` é idêntica nos dois repositórios.** Ao alterar qualquer doc (ou algo que ele descreva: rota, proxy, variável,
  fluxo), atualize `docs/` aqui e copie para `../Agregador_Link_api/docs/` (`cp docs/*.md ../Agregador_Link_api/docs/`).
  Avise o usuário para commitar nos dois repos.
- O navegador **nunca** fala direto com a API nem guarda o token: tudo passa por `/api/backend/...`
  (`app/api/backend/[...path]/route.ts`, com lista branca). Rota nova da API usada pelo front = adicionar lá.
- Não commite `.env`. Não faça commit nem push sem o usuário pedir.
- Não crie `src/pages/` (o Next trataria como rotas); telas ficam em `src/views/`.

## Comandos

- Subir: `docker compose -f docker-compose.dev.yml up -d --build -V` (depois do backend, que cria a rede).
- Verificar: `npx tsc --noEmit`.
- Porta: 3071 (API 3070).

## Convenções

- Telas da área logada carregam com `dynamic(..., { ssr: false })` (usam `window`); veja `docs/front.md`.
- Chamadas à API só por `useApi` (`src/server/api.tsx`).
- Imagens estáticas em `public/assets/`, referenciadas por string (`"/assets/x.png"`).
- Idioma da UI: português.
