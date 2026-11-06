import { Divider, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { Divide } from "phosphor-react";
import React, { useEffect } from "react";
import AppState from "../AppState";
import { useField } from "@unform/core";

interface InputeTituloProp {
  tituloUser: string;
  name: string;
}

const InputeTitulo = observer(({ tituloUser, name }: InputeTituloProp) => {
  const { fieldName, defaultValue, registerField, error } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      // ref: inputRef,
      getValue: () => {
        return AppState.descricao;
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
    AppState.incrementDescricao(event.target.value);
  };
  return (
    <FormControl>
      <FormLabel className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Título</FormLabel>
      {/* <Select placeholder="Select country" value={"nfkjn"} className=" bg-black">
        <option>United Arab Emirates</option>
        <option>Nigeria</option>
      </Select> */}

      <div className="w-full flex justify-center items-center">
        <div className="w-full flex justify-center items-center text-zinc-900 dark:text-zinc-100">
          <FormControl>
            {/* <FormControl isRequired> */}
            <Input
              variant="outline"
              placeholder={tituloUser}
              onChange={handleSubmit}
              // value={tituloUser}
            />
          </FormControl>
        </div>
      </div>
    </FormControl>
  );
});

export default InputeTitulo;
