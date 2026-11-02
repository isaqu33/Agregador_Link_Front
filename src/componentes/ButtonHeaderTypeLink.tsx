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
  const ativo = typeLink == name;

  return (
    <button
      onClick={() => {
        onchandtypeLink(name);
        onComponent(component);
        onchandText(texto)
      }}
      className={`flex items-center justify-center gap-2 px-4 py-3 -mb-px text-sm font-medium border-b-2 transition-colors ${
        ativo
          ? "border-violet-600 text-violet-700 dark:text-violet-300"
          : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
      }`}
    >
      <Icon size={18} weight={ativo ? "bold" : "regular"} />
      {name}
    </button>
  );
}
