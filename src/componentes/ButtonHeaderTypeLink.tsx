import { useEffect, useState } from "react";

export default function ButtonHeaderTypeLink({
  name,
  onchandtypeLink,
  typeLink,
  Icon,
  onComponent,
  component,
  texto,
  onchandText
}: any) {
  //logica para saber o tamanho da tela ao fazer a alteração da mesma

  const [width, setWidth] = useState(window.innerWidth);

  const updateDimensions = () => {
    setWidth(window.innerWidth);
  };
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <button
      onClick={() => {
        onchandtypeLink(name);
        onComponent(component);
        onchandText(texto)
      }}
      className='text-[22px]  w-[50%] flex flex-row  hover:boder-2  p-3 justify-center items-center font-["Lobster"] text-[#703EB9]'
      style={{
        borderBottom: `${
          typeLink == name ? "#CB8FFF 3px solid" : "#e4e4e7 3px solid"
        }`,
      }}
    >
      <Icon
        color={`${typeLink == name ? "#CB8FFF" : "#703EB9"}`}
        size={width > 617 ? 40 : 20}
        weight="bold"
      />

      {width > 617 ? name : ""}
    </button>
  );
}
