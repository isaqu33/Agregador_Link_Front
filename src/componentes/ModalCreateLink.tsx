import React, { MutableRefObject, ReactElement, useRef, useState } from "react";
import {
  schemaFormLinkType,
  schemaFormSemailType,
  schemaFormSpotifyType,
  schemaFormtwitchType,
  schemaFormwhatsappType,
  schemaFormyoutubeType,
} from "../utils/schemas";
import { CreateLink, erros } from "../utils/types";
import * as yup from "yup";

import { Form } from "@unform/web";
import Input from "./Input";
import { FormHandles } from "@unform/core";
import { useMutation, useQueryClient } from "react-query";
import useApi from "../server/api";
import { useSelector } from "react-redux";
import { userMe } from "../redux/user/sliceUser";

interface setingModalState {
  type: string;
  titulo: string;
  texto: string;
  formatolink: string;
}

interface ModalCreateLinkProp {
  cancelModal: (item: any) => any;
  typeLinkSelected: setingModalState;
  clinTypeSelected: (item: string) => any;
  callUrluser: (item: string) => void;
}

function ModalCreateLink({
  cancelModal,
  typeLinkSelected,
  clinTypeSelected,
  callUrluser,
}: ModalCreateLinkProp) {
  const { CreateNewLink } = useApi();
  const client = useQueryClient();

  const dadosuser = useSelector(userMe);

  console.log(typeLinkSelected);

  const { mutate: mutateCreateLink } = useMutation(
    (data: CreateLink) => CreateNewLink(data),
    {
      onSuccess: (sus) => {
        // console.log(sus);
        client.invalidateQueries("user");
        clinTypeSelected("");
        cancelModal(false);
        callUrluser(dadosuser.data.id);
      },
      onError: (err) => console.log(err),
    }
  );

  const formRef = useRef() as MutableRefObject<FormHandles>;

  const objverifyType = [
    {
      type: "Link",
      verify: schemaFormLinkType,
    },
    {
      type: "Spotify",
      verify: schemaFormSpotifyType,
    },
    {
      type: "Youtube",
      verify: schemaFormyoutubeType,
    },
    {
      type: "Whatsapp",
      verify: schemaFormwhatsappType,
    },
    {
      type: "Twitch",
      verify: schemaFormtwitchType,
    },
    {
      type: "Email",
      verify: schemaFormSemailType,
    },
  ];

  const handleFormSubmit = async (data: any) => {
    const type = typeLinkSelected.type as string;

    console.log(data[type]);

    // console.log(objverifyType)

    // console.log(objverifyType.filter(
    //   (elemento) => elemento.type == typeLinkSelected.type
    // )[0])

    console.log(data);
    console.log(typeLinkSelected.type);

    const setNewType = await objverifyType.filter(
      (elemento) => elemento.type == typeLinkSelected.type
    )[0];

    console.log(setNewType.verify);

    try {
      await setNewType.verify.validate(data, {
        abortEarly: false,
      });

      let objCreateLink = {
        name: "",
        link: "",
        type: "",
      };

      if (typeLinkSelected.type == "Link") {
        objCreateLink = {
          name: data.titulo,
          link: data.Link,
          type: typeLinkSelected.type,
        };
      } else {
        objCreateLink = {
          name: typeLinkSelected.type,
          link: data[type],
          type: typeLinkSelected.type,
        };
      }

      // console.log(objCreateLink)

      mutateCreateLink(objCreateLink);
    } catch (err) {
      let validationErrors: erros = {};

      if (err instanceof yup.ValidationError) {
        console.log(err);
        err.inner.forEach((error) => {
          let path = error.path as string;
          validationErrors[path] = error.message;
          console.log(path);
        });

        formRef.current.setErrors(validationErrors);
      }
    }
  };

  const [erroInput, seterroInput] = useState<string[]>([]);

  // const veryfyInputAndSend = async (data: any) => {
  //   console.log("test data:  ", data);
  //   try {
  //     //Validando Data, se invalida irá pro catch
  //     await schemaFormCreateConvite.validate(data, {
  //       abortEarly: false,
  //     });

  //     data.local = data.local.map((item: any) => JSON.stringify(item));
  //     console.log(data);
  //     mutate(data);
  //   } catch (err) {
  //     let validationErrors: erros = {};

  //     if (err instanceof yup.ValidationError) {
  //       console.log(err);
  //       err.inner.forEach((error) => {
  //         let path = error.path as string;
  //         validationErrors[path] = error.message;
  //       });

  //       formRef.current.setErrors(validationErrors);
  //     }
  //   }
  // };

  return (
    <div className="w-full  h-[90%] flex justify-center items-center p-2">
      <Form ref={formRef} onSubmit={handleFormSubmit}>
        <div className="w-[350px] h-[350px] bg-[#d3cada84] rounded-xl flex flex-col items-center p-2">
          <span className="text-[20px] text-[black]">
            {typeLinkSelected.titulo}
          </span>

          {typeLinkSelected.type === "Link" ? (
            <div className="text-[15px] font-semibold w-[100%] flex flex-col justify-center items-center  mt-2">
              <span className="text-[12px] text-[black] font-semibold   flex justify-center items-center  ">
                Titulo
              </span>
              <div className="text-[12px] font-semibold w-full   flex  ">
                <Input name="titulo" placeholder={""}></Input>
              </div>
            </div>
          ) : null}

          {typeLinkSelected.type! !== "Link" && (
            <div className="text-[15px] font-semibold w-[100%] flex justify-center items-center ">
              <span className="text-[12px] text-[#0000009e] font-semibold w-[300px]  flex justify-center items-center ">
                {typeLinkSelected.texto}
              </span>
            </div>
          )}

          <div className="text-[15px] font-semibold w-[100%] flex flex-col justify-center items-center  mt-2">
            <span className="text-[12px] text-[black] font-semibold   flex justify-center items-center ">
              {`URL do ${typeLinkSelected.type}`}
            </span>
          </div>

          {/* <div className="text-[15px] font-semibold w-[100%] flex justify-center items-center  mt-2  bg-black"> */}
          <div className="text-[12px] font-semibold w-full   flex  ">
            <Input
              name={typeLinkSelected.type}
              placeholder={typeLinkSelected.formatolink}
            ></Input>
          </div>
          {/* </div> */}

          <div className=" w-full  mt-2 flex-1 flex items-center justify-around">
            <button
              onClick={() => {
                cancelModal(false);
                clinTypeSelected("");
              }}
              className="text-[12px] font-semibold w-[100px] bg-orange-600 flex justify-center items-center rounded-xl"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="text-[12px] font-semibold w-[100px] bg-[#4c1d95] flex justify-center items-center rounded-xl"
            >
              Adicionar
            </button>
          </div>
        </div>
      </Form>
    </div>

    // <form onSubmit={(e)=>veryfyInputAndSend(e)}>
    //   <input type="text" name="cjsdcjkdcsjk"/>
    //   <button type='submit'>scfsvfd</button>
    // </form>
  );
}

export default ModalCreateLink;
