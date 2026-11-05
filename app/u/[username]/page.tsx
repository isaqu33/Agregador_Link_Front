import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PaginaPublica from '../../../src/componentes/PaginaPublica';
import { buscarPerfil, metadataDoPerfil } from '../../../src/lib/perfilPublico';

// /@usuario é reescrito para cá (next.config.mjs)
type Props = { params: { username: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const perfil = await buscarPerfil(params.username);
  return perfil ? metadataDoPerfil(perfil) : { title: 'Página não encontrada', robots: { index: false } };
}

export default async function Page({ params }: Props) {
  const perfil = await buscarPerfil(params.username);
  if (!perfil) notFound();
  return <PaginaPublica perfil={perfil} />;
}
