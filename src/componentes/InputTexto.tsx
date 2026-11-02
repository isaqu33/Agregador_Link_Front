import { Divider, FormLabel, Textarea } from "@chakra-ui/react";
import React, { useEffect } from "react";
import AppState from "../AppState";
import { useField } from "@unform/core";

interface InputTextoProp {
  textoApi?: string;
  name: string;
}

function InputTexto({ textoApi,name }: InputTextoProp) {
  const { fieldName, defaultValue, registerField, error } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      // ref: inputRef,
      getValue: () => {
        return AppState.counter;
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

  const handleSubmit = (event: any) => {
    // setInputValue(event.target.value);
    // Faça algo com o valor do input
    AppState.incrementCounter(event.target.value);
  };

  return (
    <div>
      <FormLabel className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Descrição</FormLabel>
      {/* <Textarea placeholder="Here is a sample placeholder" /> */}

      <div className="w-full flex justify-center items-center">
        <div className="w-full flex justify-center items-center text-zinc-900 dark:text-zinc-100">
          <Textarea
            placeholder={textoApi ? textoApi : "Escreva aqui sua descrição!"}
            onChange={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}

export default InputTexto;
