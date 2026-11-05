"use client";

import { useEffect } from "react";

// Conta uma visita da página pública. Falha em silêncio: nunca atrapalha quem está vendo a página.
function externa(ref: string) {
  try {
    return ref && new URL(ref).host !== location.host ? ref : undefined;
  } catch {
    return undefined;
  }
}

export default function TrackView({ perfil }: { perfil: string }) {
  useEffect(() => {
    fetch("/api/backend/analytics/view", {
      method: "POST",
      headers: { "content-type": "application/json" },
      // origem da visita: só se veio de outro site (não conta navegação interna)
      body: JSON.stringify({ profile: perfil, referrer: externa(document.referrer) }),
      keepalive: true,
    }).catch(() => {});
  }, [perfil]);

  return null;
}
