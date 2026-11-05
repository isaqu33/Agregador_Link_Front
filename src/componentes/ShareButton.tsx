"use client";

import { ShareNetwork } from "phosphor-react";
import { useState } from "react";

// Compartilhar: usa o menu do celular quando existe; senão copia o endereço.
export default function ShareButton({ url, titulo, className = "" }: { url: string; titulo?: string; className?: string }) {
  const [copiado, setCopiado] = useState(false);

  async function compartilhar() {
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: titulo, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // o usuário fechou o menu de compartilhar: nada a fazer
    }
  }

  return (
    <button type="button" onClick={compartilhar} aria-label="Compartilhar" className={className}>
      <ShareNetwork size={18} />
      {copiado && (
        <span role="status" className="absolute top-full mt-1 right-0 whitespace-nowrap rounded bg-black/80 text-white text-[11px] px-2 py-1">
          Link copiado!
        </span>
      )}
    </button>
  );
}
