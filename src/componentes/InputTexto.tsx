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
    console.log(event.target.value);
  };

  return (
    <div className=" text-[#4c1d95]">
      <FormLabel>Descrição</FormLabel>
      <Divider></Divider>
      {/* <Textarea placeholder="Here is a sample placeholder" /> */}

      <div className="w-full flex justify-center items-center">
        <div className=" min-w-[700px]  flex justify-center items-center mt-3 text-black">
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
