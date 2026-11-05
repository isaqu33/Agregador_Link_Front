import { cache } from "react";
import type { Metadata } from "next";

const apiUrl = process.env.API_INTERNAL_URL ?? "http://localhost:3070";

export interface PerfilPublico {
  id: string;
  name?: string;
  username?: string;
  photoURL?: string | null;
  template?: string | null;
  title?: string | null;
  about?: string | null;
  socials?: { network: string; url: string }[];
  links?: { id?: string; name?: string; link?: string; type?: string; isActivit?: boolean }[];
}

// Busca no servidor (SSR). `cache` evita pedir duas vezes (metadata + página).
export const buscarPerfil = cache(async (idOuUsername: string): Promise<PerfilPublico | null> => {
  const res = await fetch(`${apiUrl}/links/getDataUser/${encodeURIComponent(idOuUsername)}`, {
    cache: "no-store",
  });
  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) throw new Error(`API respondeu ${res.status}`);
  return res.json();
});

// URL pública do front (links absolutos para compartilhamento)
export function urlDoSite() {
  return (process.env.AUTH_URL ?? "http://localhost:3071").replace(/\/$/, "");
}

export function caminhoPublico(p: Pick<PerfilPublico, "id" | "username">) {
  return p.username ? `/@${p.username}` : `/${p.id}`;
}

export function metadataDoPerfil(p: PerfilPublico): Metadata {
  const nome = p.title || p.name || "FaceLink";
  const titulo = p.username ? `${nome} (@${p.username})` : nome;
  const descricao = p.about?.trim() || `Todos os links de ${nome} em um só lugar.`;
  const url = `${urlDoSite()}${caminhoPublico(p)}`;
  const imagem = p.photoURL ? (p.photoURL.startsWith("/") ? `${urlDoSite()}${p.photoURL}` : p.photoURL) : undefined;

  return {
    title: titulo,
    description: descricao,
    alternates: { canonical: url },
    openGraph: { type: "profile", title: titulo, description: descricao, url, siteName: "FaceLink", images: imagem ? [imagem] : undefined },
    twitter: { card: "summary", title: titulo, description: descricao, images: imagem ? [imagem] : undefined },
  };
}
