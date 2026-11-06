import { useField } from "@unform/core";
import { Info } from "phosphor-react";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  name: string;
  placeholder: string;
  reqired?: boolean;
  info?: string;
  valueInput?: string;
};

function Input({ name, ...rest }: Props) {
  const { fieldName, defaultValue, registerField, error } = useField(name);

  const inputRef = useRef() as React.Ref<HTMLInputElement>;

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef,
      getValue: (ref) => {
        return ref.current.value;
      },
      setValue: (ref, value) => {
        ref.current.value = value;
      },
      clearValue: (ref) => {
        ref.current.value = "";
      },
    });
  }, [fieldName, registerField]);

  return (
    <div className=" w-full h-[100%]">
      <input
        name={name}
        ref={inputRef}
        type="text"
        {...rest}

        className="w-[100%] h-full rounded-xl bg-white dark:bg-zinc-800 text-[#4c1d95] dark:text-violet-200 outline-none focus:border border-[#4c1d95] dark:border-violet-400"
      />
      {error && <div className="text-[red]">{error}</div>}
    </div>
  );
}

export default Input;
