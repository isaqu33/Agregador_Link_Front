import { Eye, Link as IconLink } from "phosphor-react";
import screenSize from "../hooks/screenSize";

export default function LogoApp() {
  const tamanhoTela = screenSize();

  return (
    <div className='flex flex-row font-["Lobster"] justify-between   sm:mb-6  text-7xl select-none '>
      <div className=" flex">
        <h1 className=" text-6xl text-zinc-100"> FaceLink </h1>
        <IconLink className="text-zinc-100" weight="duotone" />
      </div>
    </div>
  );
}
