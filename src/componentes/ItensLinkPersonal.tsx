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
}

function ItensLinkPersonal({ link, formato, formatoBase }: ItensLinksProps) {
  const [typeIcon, setTypeIcon] = useState<any>();

  // console.log(formatoBase);

  useEffect(() => {
    const setArray = typesSocialMediaa.filter(
      (elemento) => elemento.name == link?.type
    )[0];

    setTypeIcon(setArray);
    // console.log(setArray?.Icon)
  }, [link]);

  return (
    <div
      style={{ borderRadius: `${formato == "" ? formatoBase  : formato} ` }}
      className="w-full bg-[#ffffffb8] h-[60px]  text-[#4c1d95] rounded-[50px]   mb-2  flex justify-center items-center hover:bg-slate-200"
    >
      <a
        href={`${link?.link}`}
        target="_blank"
        className="w-full h-full flex justify-center items-center "
      >
        {link?.name}
      </a>
    </div>
  );
}

export default ItensLinkPersonal;
