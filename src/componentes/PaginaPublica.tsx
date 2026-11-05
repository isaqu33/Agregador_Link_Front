import Pixels from "./Pixels";
import ProfileView from "./ProfileView";
import TrackView from "./TrackView";
import { lerTemplate } from "../perfilEstilo";
import { caminhoPublico, urlDoSite, type PerfilPublico } from "../lib/perfilPublico";

// Página pública renderizada no servidor (HTML completo para buscadores e redes sociais)
export default function PaginaPublica({ perfil }: { perfil: PerfilPublico }) {
  return (
    <main className="min-h-screen flex bg-zinc-900">
      <ProfileView
        modo="publico"
        className="min-h-screen"
        dados={perfil}
        estilo={lerTemplate(perfil.template)}
        urlPublica={`${urlDoSite()}${caminhoPublico(perfil)}`}
      />
      <TrackView perfil={perfil.id} />
      <Pixels meta={perfil.pixels?.meta} ga={perfil.pixels?.ga} />
    </main>
  );
}
