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
  };

  return (
    <div>
      <FormLabel className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Formato dos botões</FormLabel>
      {/* <Textarea placeholder="Here is a sample placeholder" /> */}

      <div
        style={{ borderRadius: "50px" }}
        className="w-full flex flex-wrap gap-3 items-center"
      >
        {formatos.map((item, index) => (
          <div
            style={{ borderRadius: item.formato }}
            key={index}
            onClick={() => {
              AppState.incrementFormato("");
              AppState.incrementFormato(item.formato);
            }}
            className="w-[120px] h-10 cursor-pointer bg-zinc-200 dark:bg-zinc-700 hover:bg-violet-200 dark:hover:bg-violet-500/40 border border-zinc-300 dark:border-zinc-600 transition-colors"
          ></div>
        ))}
      </div>
    </div>
  );
}

export default InputFormato;
