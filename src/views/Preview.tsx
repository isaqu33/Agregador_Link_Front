import { observer } from "mobx-react";
import AppState from "../AppState";
import ProfileView from "../componentes/ProfileView";
import useMe from "../hooks/useMe";
import { dataToPreviue } from "../utils/types";
import { lerTemplate } from "../perfilEstilo";

interface PreviewProps {
  dados?: dataToPreviue;
}

// Prévia do painel: dados salvos + o rascunho que o usuário está editando (AppState)
const Preview = observer(({ dados }: PreviewProps) => {
  const { data: me } = useMe();
  const salvo = lerTemplate(dados?.template ?? me?.template);

  return (
    <ProfileView
      modo="preview"
      className="min-h-full"
      dados={{
        name: me?.name,
        title: AppState.descricao || me?.title,
        about: AppState.counter || me?.about,
        photoURL: me?.photoURL,
        socials: me?.socials,
        links: me?.links,
      }}
      estilo={{
        cor: AppState.corFundo || salvo.cor,
        formato: AppState.formato || salvo.formato,
        fonte: AppState.fonte || salvo.fonte,
        botao: AppState.botao || salvo.botao,
        texto: AppState.texto || salvo.texto,
        fundoMidia: AppState.fundoMidia === "remover" ? "" : AppState.fundoMidia || salvo.fundoMidia,
        marca: AppState.marca ? AppState.marca === "sim" : salvo.marca,
      }}
    />
  );
});

export default Preview;
