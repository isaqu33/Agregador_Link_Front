import BtnAddLink from "./btnAddLink";

import { LinkBreak, Plus } from "phosphor-react";
import { useState } from "react";

const img = "/assets/pixeltruewebdesign.png";

import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import SocialMediaLink from "./SocialMediaLink";
import { typesSocialMediaa } from "../utils/objectstoberendered";



interface BntAddTypeLinkProps {
  onLinktypechanged: (type: string) => void;
}

export default function BntAddTypeLink({
  onLinktypechanged,
}: BntAddTypeLinkProps) {
  const [texte, settexte] = useState("");

  const [selectedPerson, setSelectedPerson] = useState({
    Icon: (props: any) => <LinkBreak {...props} />,
    id: 1,
  });

  return (
    <div className="flex justify-center items-center w-full mb-6">
      <div className="bg-violet-600 hover:bg-violet-700 transition-colors h-11 w-full rounded-xl shadow-sm text-white">
        <div className="w-full h-full z-50">
          <Listbox value={selectedPerson} onChange={setSelectedPerson}>
            <div className="relative  w-full h-full">
              <Listbox.Button className="relative w-full h-full cursor-pointer flex items-center justify-center gap-2 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 text-sm font-medium">
                <Plus color={"#ffffff"} size={18} weight="bold" />
                Adicionar novo link
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-10"
              >
                <Listbox.Options className="absolute left-0 mt-2 max-h-[280px] w-full overflow-auto rounded-xl bg-white dark:bg-zinc-800 p-1 text-zinc-800 dark:text-zinc-100 shadow-lg ring-1 ring-black/5 border border-zinc-200 dark:border-zinc-700 focus:outline-none text-sm z-50">
                  {typesSocialMediaa.map((item, index) => (
                    <Listbox.Option
                      key={index}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 px-3 rounded-lg flex items-center ${
                          active ? "bg-violet-50 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300" : "text-zinc-800 dark:text-zinc-100"
                        } ${item.unavailable ? "opacity-40" : ""}`
                      }
                      onClick={() => {
                        onLinktypechanged(item.name);
                      }}
                      value={item}
                      disabled={item.unavailable}
                    >
                      <div className="w-full flex items-center gap-3">
                        <item.Icon color={"#7c3aed"} size={20} />
                        <span>{item.rotulo}</span>
                      </div>
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
      </div>
    </div>
  );
}
