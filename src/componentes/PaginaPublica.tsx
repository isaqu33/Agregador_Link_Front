import ProfileView from "./ProfileView";
import TrackView from "./TrackView";
import { lerTemplate } from "../perfilEstilo";
import type { PerfilPublico } from "../lib/perfilPublico";

// Página pública renderizada no servidor (HTML completo para buscadores e redes sociais)
export default function PaginaPublica({ perfil }: { perfil: PerfilPublico }) {
  return (
    <main className="min-h-screen flex bg-zinc-900">
      <ProfileView
        modo="publico"
        className="min-h-screen"
        dados={perfil}
        estilo={lerTemplate(perfil.template)}
      />
      <TrackView perfil={perfil.id} />
    </main>
  );
}
