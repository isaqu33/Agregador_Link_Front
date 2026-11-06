import {
  InstagramLogo,
  LinkSimple,
  LinkSimpleHorizontal,
  MediumLogo,
  Image,
  MapPinLine,
} from "phosphor-react";
import { Component, ReactElement, ReactNode, useEffect, useState } from "react";
import SimpleLink from "../componentes/SimpleLink";
import SocialMediaLink from "../componentes/SocialMediaLink";
import ButtonHeaderTypeLink from "../componentes/ButtonHeaderTypeLink";

export default function Links() {
  const texte = [
    {
      name: "Links",
      Icon: (props: any) => <LinkSimple {...props} />,
      componente: (props: any) => <SimpleLink />,
      texto: "Escolha seu link ou um tipo específico",
    },
    {
      name: "Image",
      Icon: (props: any) => <Image {...props} />,
      componente: (props: any) => <SocialMediaLink />,
      texto: "Escolha sua imagem",
    },
    // {
    //   name: "Image",
    //   Icon: (props: any) => <Image {...props} />,
    //   componente: <ImgLink />,
    //   texto: "Escolha uma foto para seu avatar, ou deixe o padão.",
    // },
    // {
    //     name: "Local",
    //     Icon: (props: any) => < MapPinLine {...props} />,
    //     componente: (props: any) => <h1>Local</h1>

    // }
  ];

  const [corbordaElinktype, setcorbordaElinktype] = useState("Links");
  const [textos, setTextos] = useState(texte[0].texto);

  const [componente, setcomponente] = useState<ReactNode>(<SimpleLink />);

  return (
    <div className="flex flex-col min-h-[560px]">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
        {corbordaElinktype}
      </h1>

      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{textos}</p>

      <nav className="w-full mt-6 mb-6 flex border-b border-zinc-200 dark:border-zinc-800">
        {texte.map((item, index) => (
          <ButtonHeaderTypeLink
            key={index}
            name={item.name}
            Icon={item.Icon}
            onchandtypeLink={setcorbordaElinktype}
            typeLink={corbordaElinktype}
            onComponent={setcomponente}
            component={item.componente}
            // dois itens abaixo para setar o título e texto dos itens em especifico(links e imagens)
            texto={item.texto}
            onchandText={setTextos}
          />
        ))}
      </nav>

      <div className="w-full relative min-h-[300px]  ">{componente}</div>
    </div>
  );
}
