import { useMutation, useQueryClient } from "react-query";
import InputeTipoFundo from "../componentes/InputeTipoFundo";
import InputeTitulo from "../componentes/InputeTitulo";
import { observer } from "mobx-react";
import AppState from "../AppState";
import InputTexto from "../componentes/InputTexto";
import { MutableRefObject, useEffect, useRef } from "react";
import { User, UserCACH } from "../utils/types";
import InputFormato from "../componentes/InputFormato";
import { Form } from "@unform/web";
import { FormHandles } from "@unform/core";
import useApi from "../server/api";
import { useNavigate } from "react-router-dom";

const Appearance = observer(() => {
  const { editProfile, getMe } = useApi();

  const navigate = useNavigate();

  const client = useQueryClient();
  const { mutate: mutateChangeProfile } = useMutation(
    (data: any) => editProfile(data),
    {
      onSuccess: () => {
        client.invalidateQueries("user");
        AppState.incrementCounter("");
        AppState.incrementDescricao("");
        AppState.incrementFormato("");
        AppState.incrementcorFundo("");
        window.location.reload();
      },
      onError: (err) => console.log(err),
    }
  );
  const queryClient = useQueryClient();

  const data: UserCACH | undefined = queryClient.getQueryData("USER");

  // Dentro do seu componente
  const template = data?.data?.template; // Verifique se o valor está definido corretamente

  const formRef = useRef() as MutableRefObject<FormHandles>;
  const handleFormSubmit = async (data: any) => {
    console.log(data);

    let text = {
      template: JSON.stringify({
        cor: data.cor,
        formato: data.formato,
      }),
      title: data.title,
      about: data.about,
    };

    console.log(text);

    if (text) {
      mutateChangeProfile(text);
    }
  };
  return (
    <div className="flex flex-col min-h-[560px] text-3xl ">
      <Form ref={formRef} onSubmit={handleFormSubmit}>
        <h1 className="text-[50px] text-zinc-600">Aparência</h1>

        <div className="  mt-6 rounded-lg p-3 bg-[#ffffff]">
          <div className=" mb-4 ">
            <InputeTipoFundo
              estado={AppState.corFundo}
              name="cor"
              cor={template ? JSON.parse(template).cor : ""}
            />
          </div>

          <div className="mb-4 ">
            <InputeTitulo
              name="title"
              tituloUser={data?.data.title as string}
            />
          </div>

          <div>
            <InputTexto name="about" />
          </div>

          <div>
            <InputFormato name="formato"></InputFormato>
          </div>

          <div className=" w-full min-h-[50px] h-7  flex justify-center items-center ">
            <button
              type="submit"
              className=" w-[150px]  bg-[#4c1d95] flex justify-center items-center rounded-[17px]"
            >
              Atualizar
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
});

export default Appearance;
