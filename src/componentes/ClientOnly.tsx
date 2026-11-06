"use client";

import { useSyncExternalStore } from "react";

const semAssinatura = () => () => {};

// Renderiza os filhos só no navegador (as telas do painel usam `window`), SEM Suspense.
// Antes usávamos `next/dynamic` com `loading`: o React segura a troca de um fallback por ~300 ms
// (para não "piscar"), então toda aba nova demorava isso mesmo com o código já carregado.
// Aqui: no servidor e durante a hidratação mostra `fallback`; em navegação interna renderiza direto.
export default function ClientOnly({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const noNavegador = useSyncExternalStore(semAssinatura, () => true, () => false);
  return <>{noNavegador ? children : fallback}</>;
}
