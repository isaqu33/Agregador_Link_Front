# Agregador_Link_Front (front)

Front Next.js 14 (App Router) + Auth.js do agregador de links. A API fica em `../Agregador_Link_api` (NestJS + MongoDB).

**Contexto completo em `docs/`** (`README.md`, `back.md`, `front.md`). Leia antes de mexer; tem portas, rotas, fluxo de
auth, variáveis e armadilhas.

## Regras de trabalho

- **Docs sempre em dia, nos dois projetos.** Toda mudança que afete o que `docs/` descreve (rota, proxy, variável,
  fluxo, tela, componente, estrutura de pastas) **exige** atualizar `docs/` **na mesma tarefa**, sem esperar o usuário
  pedir, e depois sincronizar os dois repositórios: `cp docs/*.md ../Agregador_Link_api/docs/`. Antes de dar a tarefa por
  concluída, confira que `diff -rq docs ../Agregador_Link_api/docs` não mostra diferença.
- **`docs/` e `CLAUDE.md` não vão para o git** (estão no `.gitignore` dos dois repos). Não os adicione a commits.
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
