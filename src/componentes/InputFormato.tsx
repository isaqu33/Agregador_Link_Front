import { Divider, FormLabel, Textarea } from "@chakra-ui/react";
import React, { useEffect } from "react";
import AppState from "../AppState";
import { useField } from "@unform/core";

interface InputFormatoProp {
  textoApi?: string;
  name: string;
}

function InputFormato({ textoApi, name }: InputFormatoProp) {
  const { fieldName, defaultValue, registerField, error } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      // ref: inputRef,
      getValue: () => {
        return AppState.formato
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

  const formatos = [
    { formato: "60px", nome: "redondo" },
    { formato: "10px", nome: "medio" },
    { formato: "0px", nome: "reto" },
  ];

  const handleSubmit = (event: any) => {
    // setInputValue(event.target.value);
    // Faça algo com o valor do input
    AppState.incrementCounter(event.target.value);
    console.log(event.target.value);
  };

  return (
    <div className=" text-[#4c1d95]">
      <FormLabel>Formato</FormLabel>
      <Divider></Divider>
      {/* <Textarea placeholder="Here is a sample placeholder" /> */}

      <div
        style={{ borderRadius: "50px" }}
        className="w-full flex  items-center min-h-[100px]  p-5"
      >
        {formatos.map((item, index) => (
          <div
            style={{ borderRadius: item.formato }}
            key={index}
            onClick={() => {
              AppState.incrementFormato("");
              AppState.incrementFormato(item.formato);
            }}
            className=" w-[170px] h-[40px] flex justify-center items-center mt-3 bg-[#d1d5db] mr-3"
          ></div>
        ))}
      </div>
    </div>
  );
}

export default InputFormato;
