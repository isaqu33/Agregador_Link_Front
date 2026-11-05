"use client";

import { useEffect } from "react";

// Conta uma visita da página pública. Falha em silêncio: nunca atrapalha quem está vendo a página.
export default function TrackView({ perfil }: { perfil: string }) {
  useEffect(() => {
    fetch("/api/backend/analytics/view", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ profile: perfil }),
      keepalive: true,
    }).catch(() => {});
  }, [perfil]);

  return null;
}
