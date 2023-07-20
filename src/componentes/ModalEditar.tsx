import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { PaintBucket } from "phosphor-react";
import React, { MutableRefObject, useRef } from "react";
import Input from "./Input";
import { link } from "../utils/types";
import { Form } from "@unform/web";
import { FormHandles } from "@unform/core";

interface ModalEditarProp {
  dataLink: link;
}

function ModalEditar({ dataLink }: ModalEditarProp) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const formRef = useRef() as MutableRefObject<FormHandles>;

  // console.log(dataLink);
  return (
    <>
      <Button
        onClick={onOpen}
        className=" bg-[#7c7484] hover:cursor-pointer hover:text-[#4c1d95] text-[#FFFADE] justify-center items-center "
      >
        Editar
        <PaintBucket
          size={26}
          //   className=" hover:cursor-pointer"
          color={"#7c7484"}
          weight="fill"
        />
      </Button>
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader> Editar Link</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div>
              <Form
                ref={formRef}
                onSubmit={(data: any) => {
                  console.log(data);
                }}
              >
                <div className="text-[15px] font-semibold w-[100%] flex flex-col justify-center items-center  mt-2 ">
                  <span className="text-[12px] text-[black] font-semibold   flex justify-center items-center  ">
                    {/* {dataLink.name} */}
                    Seu Título
                  </span>
                  <div className="text-[12px] font-semibold w-full  flex justify-center items-center   h-8">
                    <Input
                      name="titulodsds"
                      placeholder={dataLink.name as string}
                    ></Input>
                  </div>
                </div>

                <div className="text-[15px] font-semibold w-[100%] flex flex-col justify-center items-center  mt-2 ">
                  <span className="text-[12px] text-[black] font-semibold   flex justify-center items-center  ">
                    {/* {dataLink.name} */}
                    Seu Link
                  </span>
                  <div className="text-[12px] font-semibold w-full  flex justify-center items-center   h-8">
                    <Input
                      name="titulodsds"
                      placeholder={dataLink.link as string}
                    ></Input>
                  </div>
                </div>
              </Form>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Fechar
            </Button>
            <Button variant="ghost"> Editar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ModalEditar;
