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
  console.log(tituloUser);

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
    // console.log(event.target.value);
  };
  return (
    <FormControl className=" text-[#4c1d95]">
      <FormLabel>Título</FormLabel>
      <Divider></Divider>
      {/* <Select placeholder="Select country" value={"nfkjn"} className=" bg-black">
        <option>United Arab Emirates</option>
        <option>Nigeria</option>
      </Select> */}

      <div className="w-full flex justify-center items-center">
        <div className=" min-w-[700px]  flex justify-center items-center mt-3 text-black">
          <FormControl >
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
