import BtnAddLink from "./btnAddLink";

import {
  InstagramLogo,
  LinkBreak,
  LinkSimpleHorizontal,
  Image,
  MapPinLine,
  CaretDown,
  Plus,
} from "phosphor-react";
import { useEffect, useState } from "react";

import img from "../assets/pixeltruewebdesign.png";

import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import SocialMediaLink from "./SocialMediaLink";
import BntAddTypeLink from "./BntAddTypeLink";
import ImgNoLinks from "./ImgNoLinks";
import useApi from "../server/api";
import { useSelector } from "react-redux";
import { userMe } from "../redux/user/sliceUser";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { link, User } from "../utils/types";
import ItensLinks from "./ItensLinks";
import ModalCreateLink from "./ModalCreateLink";
import { objmodalCreateLink } from "../utils/objectstoberendered";
import axios from "axios";
import ModalDelet from "./ModalDelet";
import AppState from "../AppState";

function SimpleLink() {
  const { DeleteLink } = useApi();
  const client = useQueryClient();
  const dadosuser = useSelector(userMe);
  // console.log(JSON.parse(dadosuser.data.template));

  const [links, setLinks] = useState<link[]>(dadosuser.data.links);
  const [modalCreateLink, setModalCreateLink] = useState<string>("");
  const [ismodalActivate, setismodalActivate] = useState(false);
  // const [modaldelet, setmodaldelet] = useState(true)

  interface setingModalState {
    type: string;
    titulo: string;
    texto: string;
    formatolink: string;
  }
  const [setingModal, setSetingModal] = useState({} as setingModalState);

  const { mutate: mutatedeletlink } = useMutation(
    (linkid: string) => DeleteLink(linkid),
    {
      onSuccess: () => {
        client.invalidateQueries("user");

        window.location.reload();
      },
      onError: (err) => console.log(err),
    }
  );

  useEffect(() => {
    // const setArray = texte.filter((elemento) => elemento.type == link?.type)[0];

    // setTypeIcon(setArray);

    if (modalCreateLink) {
      const setArray = objmodalCreateLink.filter(
        (elemento) => elemento.type === modalCreateLink
      )[0];

      console.log(setArray);

      setSetingModal(setArray);

      if (setingModal) {
        setismodalActivate(true);
      }
    }
  }, [modalCreateLink]);

  useEffect(() => {
    setLinks(dadosuser.data.links);
  }, [dadosuser.data.links]);

  // console.log(dadosuser.data.links);

  const url = window.location.href;
  
 

  useEffect(() => {
    if (url.indexOf("/costumer") != -1) {

      console.log("entrou na condição se rota foi alterada")
      
      console.log("costumer");
      AppState.incrementDescricao("");
      AppState.incrementCounter("");
      AppState.incrementFormato("");
      AppState.incrementcorFundo("");


      
    }
  }, [url]);

  return ismodalActivate == true ? (
    <div className="w-full h-[100%] rounded-xl">
      <ModalCreateLink
        cancelModal={setismodalActivate}
        typeLinkSelected={setingModal}
        clinTypeSelected={setModalCreateLink}
        callUrluser={() => {
          window.location.reload();
        }}
      />
    </div>
  ) : JSON.stringify(dadosuser.data.links) != "[]" ? (
    <div className=" w-full  flex flex-col h-full ">
      <BntAddTypeLink onLinktypechanged={setModalCreateLink} />

      {links && (
        <div className=" w-full flex  justify-center  ">
          <span className=" text-sm text-[#403f46] ">Seus links:</span>
        </div>
      )}
      <div className=" w-full">
        {dadosuser?.data?.links?.map((item: any, index: any) => (
          <ItensLinks
            key={index}
            link={item}
            idlink={item.id}
            // excluirLink={deletLink}
          />
        ))}
      </div>
    </div>
  ) : (
    <div>
      <BntAddTypeLink onLinktypechanged={setModalCreateLink} />
      <ImgNoLinks />
    </div>
  );
}

export default SimpleLink;
