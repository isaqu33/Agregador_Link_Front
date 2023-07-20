import { Link, Outlet } from "react-router-dom";
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
import ImgLink from "../componentes/ImgLink";

export default function Links() {
  const texte = [
    {
      name: "Links",
      Icon: (props: any) => <LinkSimple {...props} />,
      componente: (props: any) => <SimpleLink />,
      texto: "Escolha seu link, ou esconha um tipo específico",
    },
    {
      name: "Image",
      Icon: (props: any) => <Image {...props} />,
      componente: (props: any) => <SocialMediaLink />,
      texto: "Escolha sua imagem ",
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
    <div className="flex flex-col min-h-[560px] text-3xl  ">
      <h1 className=" text-zinc-700 text-[50px] mb-1">{corbordaElinktype}</h1>

      <h1 className="text-[12px] sm:text-[15px] text-zinc-600 mb-2">
        {textos}
      </h1>

      <nav className="w-[100%] mt-3 p-1 flex justify-around  border-[#4c1d95] text-neutral-900 mb-3 flex-wrap">
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

      <div className="w-full relative min-h-[300px]  ">
        {componente}
      </div>
    </div>
  );
}
