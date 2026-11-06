import { Listbox } from "@headlessui/react";
import { Plus } from "phosphor-react";
import { typesSocialMediaa } from "../utils/objectstoberendered";

interface BntAddTypeLinkProps {
  onLinktypechanged: (type: string) => void;
}

// Botão "Adicionar novo link" + menu com os tipos. O menu é desmontado ao fechar (sem transição de
// saída: antes ele ficava semi-visível na tela depois de fechado).
export default function BntAddTypeLink({ onLinktypechanged }: BntAddTypeLinkProps) {
  return (
    <div className="w-full mb-6">
      <Listbox value={null} onChange={(nome: string) => onLinktypechanged(nome)}>
        <div className="relative w-full">
          <Listbox.Button className="w-full h-11 cursor-pointer flex items-center justify-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900">
            <Plus size={18} weight="bold" />
            Adicionar novo link
          </Listbox.Button>

          <Listbox.Options className="menu-in absolute left-0 mt-2 max-h-[320px] w-full overflow-auto rounded-xl bg-white dark:bg-zinc-800 p-1 text-sm text-zinc-800 dark:text-zinc-100 shadow-lg ring-1 ring-black/5 border border-zinc-200 dark:border-zinc-700 focus:outline-none z-50">
            {typesSocialMediaa.map((item) => (
              <Listbox.Option
                key={item.name}
                value={item.name}
                disabled={item.unavailable}
                className={({ active }) =>
                  `cursor-pointer select-none py-2 px-3 rounded-lg flex items-center gap-3 ${
                    active ? "bg-violet-50 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300" : ""
                  } ${item.unavailable ? "opacity-40" : ""}`
                }
              >
                <item.Icon color="#7c3aed" size={20} />
                <span>{item.rotulo}</span>
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
}
