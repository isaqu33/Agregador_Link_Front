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
  DotsSixVertical,
} from "phosphor-react";
import { typesSocialMediaa } from "../utils/objectstoberendered";
import ModalDelet from "./ModalDelet";
import { Stack, Switch } from "@chakra-ui/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation, useQueryClient } from "react-query";
import useApi from "../server/api";
import { ME_KEY } from "../hooks/useMe";
import Preview from "../views/Preview";
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

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: idlink as string });

  const { editAtivacao } = useApi();
  const client = useQueryClient();
  const tamanhoTela = screenSize();

  useEffect(() => {
    const setArray = typesSocialMediaa.filter(
      (elemento) => elemento.name == link?.type
    )[0];

    setTypeIcon(setArray);
  }, [link]);

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  const { mutate: mutateEditeStatusLink } = useMutation(
    (status: boolean) => editAtivacao(idlink as string, status),
    {
      onSuccess: () => {
        client.invalidateQueries(ME_KEY);
      },
    }
  );

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`relative w-full bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-violet-200 dark:hover:border-violet-500/50 hover:shadow-sm transition-[border-color,box-shadow] p-3 mb-3 flex items-center gap-3 ${
        isDragging ? "z-10 shadow-lg opacity-90" : ""
      }`}
    >
      <button
        type="button"
        aria-label="Arrastar para reordenar"
        className="touch-none cursor-grab active:cursor-grabbing text-zinc-300 hover:text-zinc-500 dark:text-zinc-600 dark:hover:text-zinc-400 -ml-1"
        {...attributes}
        {...listeners}
      >
        <DotsSixVertical size={20} weight="bold" />
      </button>

      <span className="w-10 h-10 shrink-0 bg-violet-600 rounded-lg flex justify-center items-center">
        {typeIcon ? <typeIcon.Icon color={"#ffffff"} size={20} /> : null}
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
          {link?.name}
        </p>
        {tamanhoTela >= 590 && link?.type !== "Cabecalho" ? (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{link?.link}</p>
        ) : null}
      </div>

      <Switch
        colorScheme="purple"
        onChange={(e: any) => {
          mutateEditeStatusLink(e.target.checked);
        }}
        defaultChecked={link?.isActivit}
      />

      <div className="flex items-center gap-1">
        <ModalEditar dataLink={link as link}></ModalEditar>
        <ModalDelet idLink={idlink as string}></ModalDelet>
      </div>
    </div>
  );
}

export default ItensLinks;
