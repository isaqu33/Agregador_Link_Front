import React, { useEffect, useState } from "react";
import { link, typeNewArrayIcom } from "../utils/types";

import {
  InstagramLogo,
  LinkBreak,
  LinkSimpleHorizontal,
  Image,
  MapPinLine,
  CaretDown,
  Plus,
  LinkSimple,
  Trash,
  Eyedropper,
  PaintBucket,
  PencilSimpleLine,
} from "phosphor-react";
import { typesSocialMediaa } from "../utils/objectstoberendered";
import ModalDelet from "./ModalDelet";
import { Stack, Switch } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "react-query";
import useApi from "../server/api";
import Preview from "../pages/Preview";
import { useNavigate } from "react-router-dom";
// import { useHistory } from "react-router-dom";
import screenSize from "../hooks/screenSize";
import ModalEditar from "./ModalEditar";

interface ItensLinksProps {
  link?: link;
  // excluirLink: (type?: string) => void;
  idlink?: string;
}

function ItensLinks({ link, idlink }: ItensLinksProps) {
  const [typeIcon, setTypeIcon] = useState<any>();

  const { editAtivacao } = useApi();
  const client = useQueryClient();
  const tamanhoTela = screenSize();

  useEffect(() => {
    const setArray = typesSocialMediaa.filter(
      (elemento) => elemento.name == link?.type
    )[0];

    setTypeIcon(setArray);
    // console.log(setArray?.Icon)
  }, [link]);

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  const { mutate: mutateEditeStatusLink } = useMutation(
    (status: boolean) => editAtivacao(idlink as string, status),
    {
      onSuccess: () => {
        client.refetchQueries("USER");
      },
      onError: (err) => console.log(err),
    }
  );

  return (
    <div className="w-full bg-[#ffffff] text-[15px] text-[#4c1d95] rounded-[17px] p-[5px] mb-2 border-[3px] border-[#4d1d9527]">
      <div className="w-full  flex justify-around items-center   border-b-[1px] border-b-[#4d1d950a]">
        <div className=" w-[70px] p-[10px]  flex justify-center items-center  ">
          <span className="w-[30px] h-8 bg-[#4c1d95] rounded-xl flex justify-center items-center">
            {typeIcon ? <typeIcon.Icon color={"#e4e4e7"} size={20} /> : null}
          </span>
        </div>
        <div className=" w-[180px]  flex justify-center items-center  ">
          {link?.name?.slice(-31)}
        </div>

        {tamanhoTela >= 590 ? (
          <div className=" w-[180px]  flex justify-center items-center  ">
            {`${link?.link?.slice(0, 19)} ...`}
          </div>
        ) : null}

        <div>
          <div>
            <Stack direction="row">
              <Switch
                colorScheme="purple"
                onChange={(e: any) => {
                  if (e.target.checked == true) {
                    mutateEditeStatusLink(true);
                  }
                  if (e.target.checked == false) {
                    mutateEditeStatusLink(false);
                  }
                }}
                defaultChecked={link?.isActivit}
              />
            </Stack>
          </div>
        </div>
      </div>
      <div className=" w-full flex justify-around  p-[8px]  ">
        {/* <PencilSimpleLine
          size={26}
          className=" hover:cursor-pointer"
          color={"#4c1d95"}
          weight="fill"
        /> */}
        {/* <span className=" flex bg-[#7C7484] hover:cursor-pointer hover:text-[#4c1d95] text-[#FFFADE] justify-center items-center w-[80px] rounded-lg">
          Editar 
          <PaintBucket
            size={26}
            className=" hover:cursor-pointer"
            color={"#FFFADE"}
            weight="fill"
          />
        </span> */}
        <ModalEditar dataLink={link as link}></ModalEditar>

        <ModalDelet idLink={idlink as string}></ModalDelet>
        {/* <Trash
        size={26}
        className=" hover:cursor-pointer"
        color={"#4c1d95"}
        weight="fill"
          onClick={() => {
            excluirLink(link?.id as string);
          }}
        ></Trash> */}
      </div>
    </div>
  );
}

export default ItensLinks;
