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
} from "phosphor-react";
import { typesSocialMediaa } from "../utils/objectstoberendered";

interface ItensLinksProps {
  link?: link;
  formato?: string;
  idlink?: string;
  formatoBase?: any;
  compact?: boolean; // visual reduzido, usado na pré-visualização
}

function ItensLinkPersonal({ link, formato, formatoBase, compact }: ItensLinksProps) {
  const [typeIcon, setTypeIcon] = useState<any>();

  useEffect(() => {
    const setArray = typesSocialMediaa.filter((elemento) => elemento.name == link?.type)[0];

    setTypeIcon(setArray);
  }, [link]);

  return (
    <div
      style={{ borderRadius: `${formato == "" ? formatoBase : formato} ` }}
      className={`w-full bg-[#ffffffb8] text-[#4c1d95] rounded-[50px] flex justify-center items-center hover:bg-slate-200 ${
        compact ? "h-11 mb-3 text-[13px] font-medium" : "h-[60px] mb-2"
      }`}
    >
      <a href={`${link?.link}`} target="_blank" className="w-full h-full flex justify-center items-center ">
        {link?.name}
      </a>
    </div>
  );
}

export default ItensLinkPersonal;
