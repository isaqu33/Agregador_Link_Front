import { Divider, FormControl, FormLabel, Select } from "@chakra-ui/react";
import { Check } from "phosphor-react";
import React, { useEffect, useRef, useState } from "react";
import AppState from "../AppState";
import { useField } from "@unform/core";

interface InputeTipoFundoProp {
  cor: string;
  name: string;
  estado: string;
}

function InputeTipoFundo({ cor, name, estado }: InputeTipoFundoProp) {
  const [gradienteCor, setGradienteCor] = useState("");
  const [normalCor, setnormalCor] = useState("");

  const { fieldName, defaultValue, registerField, error } = useField(name);

  const inputRef = useRef() as React.Ref<HTMLInputElement>;

  useEffect(() => {
    registerField({
      name: fieldName,
      // ref: inputRef,
      getValue: () => {
        if (gradienteCor != "") {
          return gradienteCor;
        }
        if (normalCor != "") {
          return normalCor;
        }
        if ((AppState.corFundo as string) != "") {
          return AppState.corFundo;
        }
        // return ref.current.value;
      },
      setValue: (ref, value) => {
        return value;
      },
      clearValue: (value) => {
        value = "";
      },
    });
  }, [fieldName, registerField]);

  const [first, setfirst] = useState(0);

  console.log(gradienteCor);
  console.log(normalCor);

  useEffect(() => {
    if (cor.indexOf("linear") != -1) {
      setGradienteCor(cor);
    } else {
      setnormalCor(cor);
    }
  }, []);

  let objCorSolida = [
    {
      nome: "azul",
      cor: "blue",
    },
    {
      nome: "vermelho",
      cor: "red",
    },
    {
      nome: "preto",
      cor: "black",
    },
    {
      nome: "roza",
      cor: "pink",
    },
  ];
  let objCorGradiente = [
    {
      nome: "azul",
      cor: "linear-gradient(to right top, #4c1d95, #663da5, #7e5bb5, #9679c5, #ae97d4)",
    },
    {
      nome: "vermelho",
      cor: " linear-gradient(to right top, #4c1d95, #c60073, #f83d36, #ed9d00, #a8eb12)",
    },
    {
      nome: "preto",
      cor: "linear-gradient(to right top, #4c1d95, #0061cf, #0094e6, #00c2e3, #12ebd6)",
    },
    {
      nome: "roza",
      cor: "linear-gradient(to right top, #4c1d95, #511caa, #5619bf, #5916d5, #5c12eb)",
    },
  ];
  let options = [
    { value: "opcao1", label: "Cor Sólida" },
    { value: "opcao2", label: "Cor Gradiente" },
    // { value: "opcao3", label: "Opção 3" },
  ];

  return (
    <FormControl className=" text-[#4c1d95]">
      <FormLabel>Fundo</FormLabel>
      <Divider></Divider>

      <div className=" w-full flex justify-around items-center mt-4 ">
        <div className=" w-[500px] h-full">
          <Select
            size="lg"
            onChange={(e) => {
              console.log(e.target.value);
              if (e.target.value == "opcao1") {
                setfirst(0);
                console.log("cor solida");
              } else {
                setfirst(1);
              }
            }}
          >
            {options.map((item, index) => (
              <option key={item.value} value={item.value}>
                {" "}
                {item.label}
              </option>
            ))}
            ;
          </Select>
        </div>
        <div className=" flex w-[300px] h-[50px] bg-[#e4e4e7] justify-around items-center p-3 rounded-md">
          {first == 0
            ? objCorSolida.map((item, indem) => (
                <div
                  key={indem}
                  onClick={() => {
                    AppState.incrementcorFundo(item.cor);
                    setGradienteCor("");
                    setnormalCor(item.cor);
                  }}
                  className=" w-[40px] h-[40px]   rounded-full p3 hover:cursor-pointer flex justify-center items-center"
                  style={{ backgroundColor: `${item.cor}` }}
                >
                  {normalCor == item.cor ? (
                    <Check color={"white"} size={22} />
                  ) : null}
                </div>
              ))
            : objCorGradiente.map((item, indem) => (
                <div
                  key={indem}
                  onClick={() => {
                    AppState.incrementcorFundo(item.cor);
                    setnormalCor("");
                    setGradienteCor(item.cor);
                  }}
                  className=" w-[40px] h-[40px]   rounded-full p3 hover:cursor-pointer flex justify-center items-center"
                  style={{
                    backgroundImage: item.cor,
                  }}
                >
                  {gradienteCor == item.cor ? (
                    <Check color="white" size={22} />
                  ) : null}
                </div>
              ))}
        </div>
      </div>
    </FormControl>
  );
}

export default InputeTipoFundo;
