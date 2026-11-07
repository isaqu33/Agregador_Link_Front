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

const img = "/assets/pixeltruewebdesign.png";

import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import SocialMediaLink from "./SocialMediaLink";
import BntAddTypeLink from "./BntAddTypeLink";
import ImgNoLinks from "./ImgNoLinks";
import useMe, { ME_KEY, pageKey } from "../hooks/useMe";
import { usePageContext } from "../contexts/PageContext";
import useApi from "../server/api";
import { useMutation, useQueryClient } from "react-query";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Spinner } from "@chakra-ui/react";
import ItensLinks from "./ItensLinks";
import ModalCreateLink from "./ModalCreateLink";
import { objmodalCreateLink } from "../utils/objectstoberendered";
import axios from "axios";
import ModalDelet from "./ModalDelet";
import AppState from "../AppState";

function SimpleLink() {
  const { data: me } = useMe();
  const links = me?.links ?? [];

  const { reorderLinks } = useApi();
  const client = useQueryClient();
  const { pageId } = usePageContext();
  const chave: any = pageKey(pageId); // cache da página aberta (principal ou extra)

  // atualiza a lista na hora (otimista) e desfaz se a API recusar
  const { mutate: reordenar } = useMutation((ids: string[]) => reorderLinks(ids), {
    onMutate: async (ids) => {
      await client.cancelQueries(chave);
      const anterior = client.getQueryData<any>(chave);
      client.setQueryData<any>(chave, (old: any) => {
        if (!old) return old;
        const porId = new Map<string, any>(old.data.links.map((l: any) => [l.id, l]));
        const ordenados = ids.map((id) => porId.get(id)).filter(Boolean);
        return { ...old, data: { ...old.data, links: ordenados } };
      });
      return { anterior };
    },
    onError: (_err, _ids, ctx) => {
      if (ctx?.anterior) client.setQueryData(chave, ctx.anterior);
    },
    onSettled: () => client.invalidateQueries(ME_KEY),
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function onDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    const ids = links.map((l: any) => l.id as string);
    reordenar(arrayMove(ids, ids.indexOf(String(active.id)), ids.indexOf(String(over.id))));
  }

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

  useEffect(() => {
    // const setArray = texte.filter((elemento) => elemento.type == link?.type)[0];

    // setTypeIcon(setArray);

    if (modalCreateLink) {
      const setArray = objmodalCreateLink.filter((elemento) => elemento.type === modalCreateLink)[0];

      setSetingModal(setArray);

      if (setingModal) {
        setismodalActivate(true);
      }
    }
  }, [modalCreateLink]);

  const url = window.location.href;

  useEffect(() => {
    if (url.indexOf("/costumer") != -1) {
      AppState.incrementDescricao("");
      AppState.incrementCounter("");
      AppState.incrementFormato("");
      AppState.incrementcorFundo("");
      AppState.incrementFonte("");
      AppState.incrementBotao("");
      AppState.incrementTexto("");
      AppState.incrementFundoMidia("");
      AppState.incrementMarca("");
    }
  }, [url]);

  return ismodalActivate == true ? (
    <div className="w-full h-[100%] rounded-xl">
      <ModalCreateLink
        cancelModal={setismodalActivate}
        typeLinkSelected={setingModal}
        clinTypeSelected={setModalCreateLink}
      />
    </div>
  ) : !me ? (
    <div className="w-full flex justify-center py-10">
      <Spinner color="purple.500" />
    </div>
  ) : links.length > 0 ? (
    <div className=" w-full  flex flex-col h-full ">
      <BntAddTypeLink onLinktypechanged={setModalCreateLink} />

      {links && (
        <div className="w-full flex mb-3">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Seus links</span>
        </div>
      )}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={links.map((l: any) => l.id)} strategy={verticalListSortingStrategy}>
          <div className="w-full">
            {links.map((item: any) => (
              <ItensLinks key={item.id} link={item} idlink={item.id} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  ) : (
    <div>
      <BntAddTypeLink onLinktypechanged={setModalCreateLink} />
      <ImgNoLinks onEscolher={setModalCreateLink} />
    </div>
  );
}

export default SimpleLink;
