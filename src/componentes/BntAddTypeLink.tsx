import BtnAddLink from "./btnAddLink";

import { LinkBreak, Plus } from "phosphor-react";
import { useState } from "react";

import img from "../assets/pixeltruewebdesign.png";

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
    <div className="flex justify-center items-center w-[100%] h-[90px] ">
      <div
        className=" bg-[#4c1d95] h-[35px] w-full max-w-[220px] rounded-[20px] mr-4  pl-2"
        onFocus={() => {
          settexte("clicado");
        }}
        style={{
          border: `${texte == "clicado" ? "#A971F1 1px solid" : "none"}`,
        }}
      >
        <div className="w-full h-full z-50">
          <Listbox value={selectedPerson} onChange={setSelectedPerson}>
            <div className="relative  w-full h-full">
              <Listbox.Button className="relative w-full h-full cursor-pointer flex items-center justify-around  focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 text-sm">
                Adicione um novo link
                {/* <CaretDown color={"#A971F1"} size={18} weight="bold" /> */}
                <Plus color={"#A971F1"} size={30} />
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-10"
              >
                <Listbox.Options className="absolute mt-3 max-h-[250px]  scrollbar-none w-ful min-w-[200px]  overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50">
                  {typesSocialMediaa.map((item, index) => (
                    <Listbox.Option
                      key={index}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-1 flex justify-around items-center hover:bg-violet-400 ${
                          active
                            ? "bg-amber-100 text-amber-900"
                            : "text-gray-900"
                        }`
                      }
                      onClick={() => {
                        onLinktypechanged(item.name);
                      }}
                      value={item}
                      disabled={item.unavailable}
                    >
                      <div className=" w-full flex justify-around">
                        <div className="   w-[500%] flex justify-center">
                          <item.Icon color={"#A971F1"} size={24} />
                        </div>
                        <div className="   w-[500%] flex justify-center">
                          {item.name}
                        </div>
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
